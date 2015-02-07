class QueriesController < ApplicationController

  #
  # Esta acción muestra la información para una determinada query. En caso que no tenga solución
  # la levanta de un archivo de texto, y la muestra en pantalla. Además, almacena dicha información
  # para futuros accesos.
  #
  def show
    @query = Query.find(params[:id])
    @marcadores = @query.locations
  end

end