class Query < ActiveRecord::Base
  belongs_to :user
  has_many :locations

  serialize :distancias
  serialize :costos
  serialize :solution

  def self.recent_queries(user_id)
    User.find(user_id).queries.limit(5)
  end

end
