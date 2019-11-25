# README

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

usersテーブル

| Column | Type | Options |
|------|----|-------|
| nickname | string |null: false |
| password |string |null: false |
| mailadress |text |null: false |
| sns_credencial | references |

### Association
- has_many :items
- has_many :comments
- has_many :messages
- has_many :reviews
- has_one :profile
- has_one :card
- has_one :sns_credencial

sns_credencialsテーブル

| Column | Type | Options |
|------|----|-------|
| user | reference |null: false, foreign_key: true |
| u-id | string | null: false |
| provider | string | null: false |

### Association
- belongs_to :user

Cardsテーブル

| Column | Type | Options |
|------|----|-------|
| user| references |null: false, foreign_key: true |
| card | string |null: false |

### Association
- belongs_to :user

Profilesテーブル

| Column | Type | Options |
|------|----|-------|
| first_name  | string | null: false |
| last_name | string | null: false |
| first_kana | string | null: false |
| last_kana | string | null: false |
| phone number | integer | null: false |
| Prefectures | string | null: false |
| city | string | null: false |
| address | string | null: false |
| building | string | null: false |
| user-id|references | null: false |

### Association
- belongs_to :user


itemsテーブル

|Column|Type|Options|
|------|----|-------|
| name | string | null: false |
| description | text | null: false |
| price | integer | null: false |
| size | string | null: false |
| brand | reference | null: false, foreign_key: true |
| category | reference | null: false, foreign_key: true |
| shipping | reference | null: false, foreign_key: true |
| state | reference | null: false, foreign_key: true |

### Association
- has_many :comments
- has_many :seller, class_name:"users"
- has_many :buyer, class_name:"users"
- belongs_to :user
- belongs_to :category
- belongs_to :brand
- belongs_to :shipping
- belongs_to :state

statesテーブル

|Column|Type|Options|
|------|----|-------|
| name | string | null: false |

### Association
- has_many :items

Brandsテーブル

|Column|Type|Options|
|------|----|-------|
| name | string | null: false |

### Association
- has_many :categories through: category_brands

categories_brandsテーブル

|Column|Type|Options|
|------|----|-------|
| categorys_id | references |null: false, foreign_key: true |
| brand_id | references |null: false, foreign_key: true |

### Association
- belongs_to :category
- belongs_to :brands

Categoriesテーブル

|Column|Type|Options|
|------|----|-------|
| name | string | null: false |
| ancestry | string | |

### Association
- has_many :brans through: categories_brands


messagesテーブル

|Column|Type|Options|
|------|----|-------|
| text | text | null: false |

### Association
- has_many :seller, class_name:"users"
- has_many :buyer, class_name:"users"


commentテーブル

|Column|Type|Options|
|------|----|-------|
| user | reference | null: false, foreign_key: true |
| item | reference | null: false, foreign_key: true |
| text | text | null: false |

### Association
- belongs_to :user
- belongs_to :item

reviewテーブル

|Column|Type|Options|
|------|----|-------|
| rate | integer | null: false |
| review | text | null: false |

### Association
- has_many :seller, class_name:"users"
- has_many :buyer, class_name:"users"


shippingテーブル

|Column|Type|Options|
|------|----|-------|
| name | string | null: false |
| ancestry | string | |

### Association
- has_many :items


