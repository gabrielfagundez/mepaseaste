class Query < ActiveRecord::Base
  belongs_to :user
  has_many :locations

  serialize :distancias
  serialize :costos
  serialize :solution

end
