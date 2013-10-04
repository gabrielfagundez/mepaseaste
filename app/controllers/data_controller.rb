class DataController < ApplicationController
  skip_before_filter :verify_authenticity_token, only: [ :process_data ]

  def process_data
    tarifa = params[:tipo_tarifa]
    precision = params[:tipo_precision]
    distancias = params[:marcadores]

    cantidad_marcadores = distancias.size + 1
    for i in 0..cantidad_marcadores - 1 do
      @matriz_distancias[i][i] = 0
      for j in 0..i do
        @matriz_distancias[i][j+1] = distancias[i][j]
        @matriz_distancias[j+1][i] = distancias[i][j]
      end
    end

    respond_to do |format|
      format.js {
        render text: 'window.location.replace("/presentacion.html");'
      }
    end
  end

end
