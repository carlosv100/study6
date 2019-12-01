
-- append
    --for INSPECTION
    insert into [inspection].[dbo].[inspection](date, time, operator, type)
    values('2019-11-01','14:05:37','carlosv','Cab');

    -- for INSPECTION_ITEM

    -- for ITEMS
    -- insert into inspection.dbo.items(item_name, asset_id) values('Block', 3);
    -- insert into inspection.dbo.items(item_name, asset_id) values('Hook', 3);
    -- insert into inspection.dbo.items(item_name, asset_id) values('Bridge', 3);
    -- insert into inspection.dbo.items(item_name, asset_id) values('Trolley', 3);
    -- insert into inspection.dbo.items(item_name, asset_id) values('Horn', 3);
    -- insert into inspection.dbo.items(item_name, asset_id) values('LIghts', 3);
    -- insert into inspection.dbo.items(item_name, asset_id) values('Runway', 3);
    -- insert into inspection.dbo.items(item_name, asset_id) values('Hook Rotator', 3);



    -- for ASSETS
    insert into inspection.dbo.assets(asset_name) values('Crane 20');
    insert into inspection.dbo.assets(asset_name) values('Crane 21');
    insert into inspection.dbo.assets(asset_name) values('Crane 30');





use inspection;
SELECT ident_current(inspect_id);

select LAST_VALUE from inspection.sys.identity_columns
where object_id in (object_id('items')) ;

select LAST_VALUE as LastValue from inspection.sys.identity_columns
where object_id in (object_id('items')) ;

DBCC CHECKIDENT ('Items');
DBCC CHECKIDENT ('Items', reseed, 1)  

--insert inspection record
insert into inspection.dbo.inspection 
(inspect_asset, inspect_date, inspect_time, inspect_operator, inspect_control_mode)
values('Crane 20', '2019-11-26', '15:52:27', 'carlosv', 'Cab');

-- get inspection ID: recid
select inspect_id from inspection.dbo.inspection
where inspect_asset = 'Crane 20' and inspect_date = '2019-11-26' and inspect_time = '15:52:27';
-- output: 4

-- get item_id from Items
insert into inspection.dbo.inspectionitems 
(item_name, item_status, item_comments, asset_name, inspect_id)
values('Block', 'Pass', '', 'Crane 20', '4')


-- based on craneId,
-- get the items for crane.




select Items.item_name as items
from [inspection].[dbo].[Assets] INNER JOIN
        [inspection].[dbo].[Items] ON Assets.recid = Items.asset_id
where Assets.asset_name = 'Crane 20';

select * from [inspection].[dbo].[assets];

select * from [inspection].[dbo].[items];

insert into [inspection].[dbo].[items]
([item_name], [asset_id])
values('Crane 20 item',1);

insert into inspection.dbo.items(item_name, asset_id)
values('Crane 21 item',3);

insert into inspection.dbo.items(item_name, asset_id)
values('Crane 30 item',2);

-- delete from inspection.dbo.items where recid = 28 or recid = 29;

-- submit string

select * from inspection.dbo.inspection;
select * from inspection.dbo.inspection_item;
select * from inspection.dbo.items;
select * from inspection.dbo.assets;



alter table inspection.dbo.inspection_item
alter column inspect_id int NOT NULL;

alter table inspection.dbo.inspection_item
alter column item_id int NOT NULL;

alter table inspection.dbo.inspection_item
alter column asset_name varchar(25) NOT NULL;

alter table inspection.dbo.inspection_item
alter column item_name varchar(25) NOT NULL;

alter table inspection.dbo.inspection_item
alter column status char(4) not null;


--truncate table inspection.dbo.items;
--truncate table inspection.dbo.inspection_item;
--truncate table inspection.dbo.inspection;

select * from inspection.dbo.inspection_item
select * from inspection.dbo.inspection

delete from inspection.dbo.inspection where inspect_id is not null;

alter table inspection.dbo.items
alter column item_name varchar(25) not null;

alter table inspection.dbo.inspection_item
alter column item_name varchar(25) not null;

alter table inspection.dbo.items
add UNIQUE (item_name);

use inspection;
select * from information_schema.columns
where table_name = 'items'

exec sp_help items

SELECT * FROM sys.objects where type='f'


alter table inspection.dbo.items
add CONSTRAINT CI_Item_Itemname UNIQUE (item_name, asset_name);

-- delete / reset  ############################################

--delete from inspection.dbo.assets where recid is not null
--DBCC CHECKIDENT('inspection.dbo.assets', reseed, 0);

select * from inspection.dbo.inspectionitems;
delete from inspection.dbo.inspectionitems where rec_id is not null;
dbcc CHECKIDENT('inspection.dbo.inspectionItems', reseed, 0);

select * from inspection.dbo.inspection;
delete from inspection.dbo.inspection where inspect_id is not null;
DBCC CHECKIDENT('inspection.dbo.inspection', reseed, 0);

select * from inspection.dbo.items;
--delete from inspection.dbo.items where item_id is not null;
--DBCC checkident('inspection.dbo.items', reseed, 0);

select * from inspection.dbo.assets
--delete from inspection.dbo.assets where asset_id is not null;
--DBCC checkident('inspection.dbo.assets', reseed, 0);


-- add/remove unique constraint  ###################################
alter table inspection.dbo.inspection
add CONSTRAINT unique_inspect UNIQUE (inspect_date, inspect_time);

alter TABLE inspection.dbo.inspection
drop CONSTRAINT unique_inspect;


-- check identity (and reset)

dbcc checkident('inspection.dbo.inspectionitems', reseed);


DBCC CHECKIDENT('inspection.dbo.inspection', reseed);

select * from inspection.dbo.inspection; 
select * from inspection.dbo.inspectionitems;