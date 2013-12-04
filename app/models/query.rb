class Query < ActiveRecord::Base
  belongs_to :user
  has_many :locations

  serialize :distancias
  serialize :costos
  serialize :solution

  def self.recent_queries(user_id)
    User.find(user_id).queries.limit(5)
  end

  def taxi_address(location_query_id)
    location = Location.find_by_query_id_and_location_query_pos(self.id, location_query_id)
    return nil unless location

    location.address.present? ? location.address : 'No se ha podido determinar la direccion de este lugar.'
  end

  def taxi_name(location_query_id)
    location = Location.find_by_query_id_and_location_query_pos(self.id, location_query_id)
    return nil unless location

    location.name.present? ? location.name : 'Este lugar aun no tiene un nombre.'
  end

end
