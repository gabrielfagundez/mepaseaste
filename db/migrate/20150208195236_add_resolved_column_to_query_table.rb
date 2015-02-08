class AddResolvedColumnToQueryTable < ActiveRecord::Migration
  def change
    add_column :queries, :resolved, :boolean, default: false
  end
end
