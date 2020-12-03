# README
##how to use Github Desktop

This README would normally document whatever steps are necessary to get the
application up and running.

Things you may want to cover:

* Ruby version

* System dependencies

* Configuration

* Database creation

* Database initialization

* How to run the test suite

* Services (job queues, cache servers, search engines, etc.)

* Deployment instructions

* ...

##  usersテーブル

|Column|Type|Option|
|------|----|------|
|nickname|string|null:false|
|email|string|null:false,unique:true:true|
|password|string|null:false,unique:true:true|
|family_name|string|null:false|
|first_name|string|null:false|
|family_name_kana|string|null:false|
|first_name_kana|string|null:false|
|birthday|date|null:false|

##  Association

-has_many :addresses
-has_many :exhibitors
-has_many :items
-has_many :comments

##  addressesテーブル

|Column|Type|Option|
|------|----|------|
|user_id|references|
|postcode|string|
|municipalities|string|null:false|
|address|string|null:false|
|building|string|null:false|
|phone_number|string|null:false|

##  Association

-belongs to :user

##  itemsテーブル

|Column|Type|Option|
|------|----|------|
|user_id|references|foreign_key: true|
|name|string|null:false|
|price|string|null:false|
|comment|text|null:false|
|shopping_charge|field|null:false|
|prefecture_id|references|foreign_key: true|
|shopping_date|field|null:false|

##  Association

-has_many :exhibitors
-has_many :comments
-belongs to :user

##  exhibitorsテーブル

|Column|Type|Option|
|------|----|------|
|user_id|references|foreign_key: true|
|item_id|references|foreign_key: true|

##  Association

-belongs to :item
-belongs to :user

## commentsテーブル

|Column|Type|Option|
|------|----|------|
|user_id|references|null:false|
|item_id|references|null:false|
|comment|text|null:false|

##  Association

-belongs to :user
-belongs to :item

##  imagesテーブル

|Column|Type|Option|
|------|----|------|
|item_id|references|null:false|
|image|field|null:false|

##  Association

-belong to :item

## credit_cardsテーブル

|Column|Type|Option|
|------|----|------|
|user_id|references|null:false|
|token|string|

##  Association

-belongs to :user

