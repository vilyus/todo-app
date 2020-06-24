from flask import Flask, request, jsonify
from flask_cors import CORS
from flask_marshmallow import Marshmallow
from flask_sqlalchemy import SQLAlchemy
from marshmallow import ValidationError

app = Flask(__name__)
cors = CORS(app)
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///db.sqlite'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
app.config['SQLALCHEMY_ECHO'] = True
db = SQLAlchemy(app)
ma = Marshmallow(app)


# Models
class Task(db.Model):
    """`Task` is a collection of `TodoItem`s
    """
    id = db.Column(db.Integer, primary_key=True, nullable=False)
    title = db.Column(db.UnicodeText, nullable=False)

    def __repr__(self) -> str:
        return f'<Task #{self.id} {self.title}>'


class TodoItem(db.Model):
    """`TodoItem` is a checkable item in a `Task`
    """
    id = db.Column(db.Integer, primary_key=True, nullable=False)

    task_id = db.Column(db.Integer, db.ForeignKey('task.id'))
    task = db.relationship(
        'Task',
        backref=db.backref(
            'items',
            lazy='dynamic',
            order_by='TodoItem.id',
            cascade='all, delete-orphan',
        ),
    )

    title = db.Column(db.UnicodeText, nullable=False)
    order = db.Column(db.Integer, nullable=False, server_default='0')
    checked = db.Column(db.Boolean, nullable=False, server_default='0')

    def __repr__(self) -> str:
        return f'<TodoItem #{self.id} ' \
               f'[task {self.task and self.task.title}] {self.title}>'


db.create_all()


# Data schema for API
class TodoItemSchema(ma.SQLAlchemyAutoSchema):
    class Meta:
        model = TodoItem

    id = ma.auto_field()
    task_id = ma.auto_field(data_key='taskId')
    title = ma.auto_field()
    order = ma.auto_field()
    checked = ma.auto_field()

    task = ma.Nested(lambda: TaskSchema(exclude=['items']), dump_only=True)


class TaskSchema(ma.SQLAlchemyAutoSchema):
    class Meta:
        model = Task

    id = ma.auto_field()
    title = ma.auto_field()

    items = ma.Nested('TodoItemSchema', exclude=['task'], many=True)


# endpoints
# It's a demo - so no auth
@app.route('/task/', methods=['GET', 'POST'])
def task_list():
    """GET: get list of `Task`s
    POST: create a new `Task`
    """
    if request.method == 'GET':
        tasks = Task.query.all()
        return TaskSchema().jsonify(tasks, many=True)

    assert request.method == 'POST'

    try:
        new_task = TaskSchema(exclude=['id', 'items']).load(request.json)
    except ValidationError as e:
        return e.normalized_messages(), 400

    new_task = Task(**new_task)
    db.session.add(new_task)
    db.session.commit()

    return TaskSchema().jsonify(new_task), 201


@app.route('/task/<int:task_id>', methods=['GET', 'PUT', 'DELETE'])
def task(task_id: int):
    """GET: get one `Task` by `task_id`
    PUT: update an existing `Task` and its `TodoItem`s
    DELETE: delete an existing `Task` and its `TodoItem`s
    """
    task = Task.query.get(task_id)

    if task is None:
        return jsonify(error='Task not found'), 404

    if request.method == 'GET':
        return TaskSchema().jsonify(task)

    elif request.method == 'PUT':

        fields = TaskSchema().load(request.json)

        if int(fields.pop('id', task_id)) != task_id:
            return dict(error='invalid id'), 400

        items = fields.pop('items', None)
        for field, value in fields.items():
            setattr(task, field, value)
        if items is not None:
            task.items = [TodoItem(**todo_item) for todo_item in items]

        db.session.add(task)
        db.session.commit()

        return TaskSchema().jsonify(task)

    assert request.method == 'DELETE'
    db.session.delete(task)
    db.session.commit()

    return jsonify(id=task_id)
