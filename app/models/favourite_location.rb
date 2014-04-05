class FavouriteLocation < ActiveRecord::Base
  belongs_to :user

  validates_presence_of :address, message: 'no puede ser nula. Luego de hacer click en el mapa, espera unos segundos.'
  validates_presence_of :latitude, message: 'no puede ser nula. Haz click en el mapa antes de enviar los datos.'
  validates_presence_of :longitude, message: 'no puede ser nula. Haz click en el mapa antes de enviar los datos.'
  validates_presence_of :name, message: 'no puede ser nulo. Olvidaste ingresar el nombre?'


end
