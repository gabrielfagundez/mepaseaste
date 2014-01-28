class QueriesController < ApplicationController

  def index
    @queries = current_user.queries.limit(10)
  end

end