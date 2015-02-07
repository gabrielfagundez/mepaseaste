class QueriesController < ApplicationController

  #
  # Esta acción muestra la información para una determinada query. En caso que no tenga solución
  # la levanta de un archivo de texto, y la muestra en pantalla. Además, almacena dicha información
  # para futuros accesos.
  #
  def show
    @query = Query.find(params[:id])
    respond_to do |format|
      format.html {
        @marcadores = @query.locations
      }
      format.json {
        render json: JSON.parse(Query.first.to_json).merge({ marcadores: Query.first.locations }).to_json
      }
    end
  end

end