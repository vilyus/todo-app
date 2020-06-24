from typing import Optional

from flask import Flask, request, jsonify, abort, make_response
from flask_cors import CORS
from flask_marshmallow import Marshmallow
from flask_restful import Api, Resource
from flask_sqlalchemy import SQLAlchemy
from marshmallow import ValidationError, validate

app = Flask(__name__)
cors = CORS(app)
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///db.sqlite'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
app.config['SQLALCHEMY_ECHO'] = True
db = SQLAlchemy(app)
ma = Marshmallow(app)
api = Api(app)


# Models
class TodoList(db.Model):
    """`TodoList` is a collection of `TodoItem`s
    """
    id = db.Column(db.Integer, primary_key=True, nullable=False)
    title = db.Column(db.UnicodeText, nullable=False)

    def __repr__(self) -> str:
        return f'<TodoList #{self.id} {self.title}>'


class TodoItem(db.Model):
    """`TodoItem` is a checkable item in a `TodoList`
    """
    id = db.Column(db.Integer, primary_key=True, nullable=False)

    list_id = db.Column(db.Integer, db.ForeignKey('todo_list.id'))
    list = db.relationship(
        'TodoList',
        backref=db.backref(
            'items',
            lazy='dynamic',
            order_by='TodoItem.id',
            cascade='save-update, merge, delete',
        ),
    )

    title = db.Column(db.UnicodeText, nullable=False)
    order = db.Column(db.Integer, nullable=False, server_default='0')
    checked = db.Column(db.Boolean, nullable=False, server_default='0')

    def __repr__(self) -> str:
        return f'<TodoItem #{self.id} ' \
               f'[list {self.list and self.list.title}] {self.title}>'


db.create_all()


def create_fixture():
    todo_list = TodoList(title='Задачи на сегодня')
    todo_list.items = [
        TodoItem(title='Купить капусту', order=10),
        TodoItem(title='Купить морковь', order=20),
        TodoItem(title='Купить гречки', order=30),
        TodoItem(title='Оплатить покупки', order=40),
        TodoItem(title='Не забыть хлеб', order=50),
    ]

    db.session.add(todo_list)
    db.session.commit()


# Data schema for API
class TodoItemSchema(ma.SQLAlchemyAutoSchema):
    class Meta:
        model = TodoItem

    id = ma.auto_field()
    list_id = ma.auto_field(data_key='listId')
    title = ma.auto_field()
    order = ma.auto_field()
    checked = ma.auto_field()

    list = ma.Nested(lambda: TodoListSchema(exclude=['items']), dump_only=True)


class TodoListSchema(ma.SQLAlchemyAutoSchema):
    class Meta:
        model = TodoList

    id = ma.auto_field()
    title = ma.auto_field()

    items = ma.Nested(
        'TodoItemSchema', exclude=['list'],
        many=True, dump_only=True,
    )


# Helper to register API resources with a class decorator
def api_register(*urls, **kwargs):
    """helper class decorator to register API-Resources
    """
    def decorator(resource):
        api.add_resource(resource, *urls, **kwargs)
        return resource
    return decorator


# REST endpoints
# It's a demo - so no auth
@api_register('/todo-list/')
class TodoListsResource(Resource):
    def get(self):
        """get list of `TodoList`s
        """
        lists = TodoList.query.all()
        return TodoListSchema().dump(lists, many=True)

    def post(self, todo_id: Optional[int] = None):
        """create new `TodoList`
        """
        try:
            new_list = TodoListSchema(exclude=['id']).load(request.json)
        except ValidationError as e:
            return e.normalized_messages(), 400

        new_list = TodoList(id=todo_id, **new_list)
        db.session.add(new_list)
        db.session.commit()

        return TodoListSchema().dump(new_list), 201


@api_register('/todo-list/<int:todo_id>')
class TodoListResource(Resource):
    def _get_todo_list(self, todo_id: int):
        todo_list = TodoList.query.get(todo_id)
        if todo_list is None:
            abort(make_response(jsonify(error='TodoList not found'), 404))
        return todo_list

    def get(self, todo_id: int):
        """get one `TodoList` by `todo_id`
        """
        return TodoListSchema().dump(self._get_todo_list(todo_id))

    def put(self, todo_id: int):
        """update or create `TodoList`
        """

        todo_list = TodoList.query.get(todo_id)
        if todo_list is None:
            return TodoListResource().post(todo_id)

        fields = TodoListSchema().load(request.json)

        if int(fields.pop('id', todo_id)) != todo_id:
            return dict(error=f'invalid id'), 400

        for field, value in fields.items():
            setattr(todo_list, field, value)
        db.session.add(todo_list)
        db.session.commit()

        return TodoListSchema().dump(todo_list)

    def delete(self, todo_id: int):
        """delete existing `TodoList`
        """
        todo_list = self._get_todo_list(todo_id)
        db.session.delete(todo_list)
        db.session.commit()

        return jsonify(id=todo_id)


@api_register('/todo-item/')
class TodoItemsResource(Resource):

    def post(self, item_id: Optional[int] = None):
        """create new `TodoItem`
        """
        try:
            new_item = TodoItemSchema(exclude=['id']).load(request.json)
        except ValidationError as e:
            return e.normalized_messages(), 400

        new_item = TodoItem(id=item_id, **new_item)
        db.session.add(new_item)
        db.session.commit()

        return TodoItemSchema().dump(new_item), 201


@api_register('/todo-item/<int:item_id>')
class TodoItemResource(Resource):
    def _get_todo_item(self, item_id: int):
        item = TodoItem.query.get(item_id)
        if item is None:
            abort(make_response(jsonify(error='TodoItem not found'), 404))
        return item

    def put(self, item_id: int):
        """update or create `TodoItem`
        """

        item = TodoItem.query.get(item_id)
        if item is None:
            return TodoItemSchema().post(item)

        fields = TodoItemSchema().load(request.json)

        if int(fields.pop('id', item_id)) != item_id:
            return dict(error=f'invalid id'), 400

        for field, value in fields.items():
            setattr(item, field, value)
        db.session.add(item)
        db.session.commit()

        return TodoItemSchema().dump(item)

    def delete(self, item_id: int):
        """delete existing `TodoItem`
        """
        item = self._get_todo_item(item_id)
        db.session.delete(item)
        db.session.commit()

        return jsonify(id=item_id)
