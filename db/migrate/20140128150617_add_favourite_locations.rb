class AddFavouriteLocations < ActiveRecord::Migration
  def change
    create_table :favourite_locations do |t|
      t.integer :user_id
      t.string  :latitude
      t.string  :longitude
      t.string  :icon
      t.string  :name
      t.string  :address

      t.timestamps
    end
  end
end
