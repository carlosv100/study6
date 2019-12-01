const sql = require('mssql');


// config for database connection
var dbConfig = {
    user: 'carlosv',
    password: 'piggie221',
    server: 'carlosv8', 
    database: 'inspection' 
};

var tbConfig = {
    inspectionTable: 'inspection',
    inspectionItemsTable: 'inspectionItems',
    schema: 'dbo'
};

const connection = new sql.ConnectionPool(dbConfig);

var CraneInspect = function() {
    connection.connect(err => { if(err) console.log('somthing went wrong with the connection:   ' + err); });
};

function recordNotFound(message) {
    Error.call(this);
    this.message = message;
    this.status = 404;
}

CraneInspect.prototype.get = function(recordId, callback) {
    var id = parseInt(recordId);
    var query = `select * from inspection where inspect_id = ${id}`;

    connection.query(query,
        function(err, result) {
            if(!err) {
                var row = [];
                if(parseInt(result.rowsAffected) > 0) {
                    Object.keys(result.recordsets[0][0]).forEach(function(key) {
                        row.push(key + ' : ' + result.recordsets[0][0][key]);
                    });
                   callback(null, row);
                } else {
                    callback(new recordNotFound('Record does not exist!'),
                        {message: 'Record does not exist!'});
                }
            } else {
                console.log(err);
                callback(err, null);
            }
        }
    );
};

CraneInspect.prototype.getAll = function(callback) {
    var query = 'select * from inspection';
    connection.query(query, function(err, rows) {
        if(err) {
            callback(err, null);
        } else {
            callback(null, rows);
        }
    });
};

CraneInspect.prototype.append = function(record, callback) {
    try { 
        var query = {
            //insert inspection record
            insertRecord : `insert into ${dbConfig.database}.${tbConfig.schema}.${tbConfig.inspectionTable} `+
                `(inspect_asset, inspect_date, inspect_time, inspect_operator, inspect_control_mode) `+
                `values('${record.inspectRecord.Asset}', '${record.inspectRecord.Date}', `+
                `'${record.inspectRecord.Time}', '${record.inspectRecord.Operator}', `+
                `'${record.inspectRecord.ControlMode}');`,

            //get inspection ID: recid
            getRecId : `select inspect_id from ${dbConfig.database}.${tbConfig.schema}.${tbConfig.inspectionTable} `+
                `where   inspect_asset =  '${record.inspectRecord.Asset}' and `+
                        `inspect_date = '${record.inspectRecord.Date}' and `+
                        `inspect_time = '${record.inspectRecord.Time}'`,

        };

        query.insertItem = [];
        record.inspectItems.forEach((element, index) => {

            query.insertItem[index] = { query : `insert into ${dbConfig.database}.${tbConfig.schema}.${tbConfig.inspectionItemsTable} `+
            `(item_name, item_status, item_comments, asset_name, inspect_id) values(`+
            `'${element.itemname}', `+
            `'${element.status}', `+
            `'${element.comments}', `+
            `'${record.inspectRecord.Asset}', `+
            `@recid)`};
        });
            
        const transaction = new sql.Transaction(connection);

        transaction.begin(2, (err) => {
            var request = new sql.Request(connection);
            //var request = new sql.Request(connection);
            //var request = new sql.Request(connection);
            
            // Insert new record    ################################
            request.query(query.insertRecord, (err, result) => {
                if(err) {
                    console.log(err);
                    callback(err, null);
                    return;
                } else {
                    // get record id        ################################
                    //request.output('inspect_id', sql.Int, 0);
                    request.query(query.getRecId, (err, result) => {
                        if(err) {
                            console.log(err);
                            callback(err, null);
                            return;
                        } else {
                            //insert Items    ################################
                            request.input('recid', sql.Int, result.recordset[0].inspect_id);
                            query.insertItem.forEach((element, index) => {
                                request.query(element.query, (err, result) => {
                                    if(err) {
                                        callback(err, null);
                                    } 
                                }); //end: insert Items
                            }); // end loop
                        } // end if
                    }); // end: get Record ID
                    callback(err, result);
                } //end: Insert Record
            });

            transaction.commit(err => {
                if(err) {
                    console.log('commit error:  ' + err);
                } else {
                    console.log("Transaction committed.");
                }
            });
        }); // end transaction

            //connection.query(query, (err, rows) => {
            //if(err) {
            //    callback(err, null);
            //} else {
            //    callback(null, rows);
            //}
        //});
    } catch(err) {
        callback(err);
    }

    //if(err) {
    //    callback(err, null);
    //} else {
    //    callback(null, rows);
    //}

};

CraneInspect.prototype.save = function(record, callback) {
    try {
        var id = parseInt(record.recordId);
        var query = `update inspection set [date]='${record.date}','` + 
                                 `[time]='${record.time}'` + 
                                 `[operator]='${record.operator}'` + 
                                 `[type]='${record.control_mode}'` +
                                 `where recordId='${id}'`;
        connection.query(query, function(err, result) {
                if(err) {
                    console.log(JSON.stringify(err));
                    callback(err,null);
                } else {
                    callback(null, result);
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
            'delete from inspection.dbo.inspection where inspect_id=?',
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

CraneInspect.prototype.getAssets = function(callback) {
    var query = 'select * from Assets';
    connection.query(query, function(err, rows) {
        if(err) {
            callback(err, null);
        } else {
            callback(null, rows);
        }
    });
};

CraneInspect.prototype.getItems = function(craneId, callback) {
    var query = `select items.item_name as items
                    from inspection.dbo.items
                    where asset_name = '${craneId}'`;
    connection.query(query, function(err, rows) {
        if(err) {
            callback(err, null);
        } else {
            callback(null, rows);
        }
    });
};

module.exports = CraneInspect;