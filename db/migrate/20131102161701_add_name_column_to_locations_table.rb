class AddNameColumnToLocationsTable < ActiveRecord::Migration
  def change
    add_column :locations, :name, :string, default: ''
  end
end
