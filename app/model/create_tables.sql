drop table inspection.dbo.assets;
create table inspection.dbo.assets (
        asset_id int IDENTITY(1,1) PRIMARY KEY,
        asset_name varchar(25) UNIQUE NOT NULL
);

drop table inspection.dbo.items;
create table inspection.dbo.items (
        item_id int IDENTITY(1,1) PRIMARY KEY,
        item_name varchar(25) NOT NULL,
        asset_name varchar(25) NOT NULL,
        CONSTRAINT unique_asset_name UNIQUE(item_name, asset_name),
        CONSTRAINT fk_asset_name FOREIGN KEY(asset_name)
        REFERENCES inspection.dbo.assets(asset_name)
);

drop table inspection.dbo.inspection_Item;
create table inspection.dbo.inspectionItems (
        rec_id int IDENTITY(1,1) PRIMARY KEY,
        item_name varchar(25) NOT NULL,
        item_commanents varchar(100) NULL,
        item_status CHAR(4) NULL,
        asset_name VARCHAR(25) NOT NULL,
        insepct_id int NOT NULL,
        CONSTRAINT fk_item_name FOREIGN KEY(item_name, asset_name)
        REFERENCES inspection.dbo.items(item_name, asset_name),
        --CONSTRAINT fk_asset_name FOREIGN KEY(asset_name)
        --REFERENCES inspection.dbo.assets(asset_name)
);

drop table inspection.dbo.inspection;
create table inspection.dbo.inspection (
        inspect_id int IDENTITY(1,1) PRIMARY KEY,
        inspect_asset varchar(25) NOT NULL,
        inspect_date VARCHAR(10) NOT NULL,
        inspect_time VARCHAR(8) NOT NULL,
        inspect_operator VARCHAR(25) NOT NULL,
        inspect_control_mode VARCHAR(10) NOT NULL
);