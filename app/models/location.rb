class Location < ActiveRecord::Base
  belongs_to :query
  belongs_to :user

  scope :order_by_quantity, order('quantity DESC, id DESC')

end
