class AddQuantityAndUserIdToLocation < ActiveRecord::Migration
  def change
    add_column :locations, :user_id, :integer, default: nil
    add_column :locations, :quantity, :integer, default: 0
  end
end
