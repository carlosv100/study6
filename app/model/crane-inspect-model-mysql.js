var mysql = require('mysql');

var connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'piggie221',
    database: 'inspection'
});


var CraneInspect = function() {
    connection.connect();
};

function recordNotFound(message) {
    Error.call(this);
    this.message = message;
    this.status = 404;
}

CraneInspect.prototype.get = function(recordId, callback) {
    var id = parseInt(recordId);
    console.log('Record Id: ' + id);
    connection.query('select * from crane where recordId = ?', [id],
        function(err, rows, fields) {
            if(!err) {
                if(rows.length > 0) {
                    callback(null, rows);
                } else {
                    callback(new recordNotFound('Record does not exist!'),
                        {message: 'Record does not exist!'});
                }
            } else {
                callback(err, null);
            }
        }
    );
};

CraneInspect.prototype.getAll = function(callback) {
    connection.query('select * from crane',
        function(err, rows, fields) {
            if(!err) {
                callback(null, rows);
            } else {
                callback(err, null);
            }
        }
    );

};

CraneInspect.prototype.append = function(record, callback) {
    try {
        connection.query(
            'insert into crane (date, time, operator, type) ' +
            'values (?, ?, ?, ?)',
            [record.date, record.time, record.operator, record.type],
            function(err, rows) {
                if(err) {
                    console.log(err);
                    callback(err);
                } else {
                    callback(null);
                }
            }
        );
    } catch(err) {
        console.log(err);
        callback(err);
    }
};

CraneInspect.prototype.save = function(record, callback) {
    try {
        var id = parseInt(record.recordId);

        connection.query(
            'update crane set date=?, time=?, operator=?, type=? ' +
            'where recordId=?',
            [record.date, record.time, record.operator, record.type, id],
            function(err, rows) {
                if(err) {
                    console.log(JSON.stringify(err));
                    callback(err);
                } else {
                    callback(null);
                }
            }
        );
    } catch(err) {
        callback(err);
    }
};

CraneInspect.prototype.delete = function(recordId, callback) {
    try {
        var id = parseInt(recordId);

        connection.query(
            'delete from crane where recordId=?',
            [id],
            function(err, rows) {
                if(err) {
                    console.log(JSON.stringify(err));
                    callback(err);
                } else {
                    callback(null);
                }
            }
        );
    } catch(err) {
        callback(err);
    }
};

module.exports = CraneInspect;