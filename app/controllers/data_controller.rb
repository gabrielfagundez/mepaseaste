class DataController < ApplicationController
  skip_before_filter :verify_authenticity_token, only: [ :process_data ]

  def process_data
    tarifa = params[:tipo_tarifa]
    precision = params[:tipo_precision]
    distancias = params[:marcadores]

    cantidad_marcadores = distancias.size

    # Matrices de costo y distancia
    @matriz_distancias  = Array.new(cantidad_marcadores) { Array.new(cantidad_marcadores) }
    @matriz_costos      = Array.new(cantidad_marcadores) { Array.new(cantidad_marcadores) }

    # Rellenamos la matriz de distancias
    for i in 0..cantidad_marcadores - 1 do
      @matriz_distancias[i][i] = 0
      for j in 0..i do
        @matriz_distancias[i][j] = distancias[i][j] if i != j
        @matriz_distancias[j][i] = distancias[i][j] if i != j
      end
    end

    # Creamos los archivos que usara el Algoritmo Evolutivo
    FileUtils.touch('ae_files/parametros.txt')
    FileUtils.touch('ae_files/costos.txt')

    # Creamos el archivo de configuración paramétrica de nuestro algoritmo
    cantidad = 2 * (cantidad_marcadores - 1) - 1
    File.open('ae_files/' + '/parametros.txt', 'w') do |file|
      file.write cantidad
      file.write "\n"
      tarifa == 'diurna' ? (file.write BANDERA_DIURNA) : (file.write BANDERA_NOCTURNA)
      file.write "\n"
      file.write '0'
      file.write "\n"
      file.write 'ae_files/costos.txt'
    end

    # Copiamos la matriz de costos
    for i in 0..(cantidad_marcadores - 1) do
      for j in 0..(cantidad_marcadores - 1) do
        if @matriz_distancias[i][j] > 100
          costo_actual = 0
          costo_actual += tarifa == 'diurna' ? (((@matriz_distancias[i][j])/100).to_i) * (CIEN_METROS_DIURNO) : (((@matriz_distancias[i][j])/100).to_i) * (CIEN_METROS_NOCTURNO)
          @matriz_costos[i][j] = costo_actual
        else
          @matriz_costos[i][j] = 0
        end
      end
    end

    # Creamos la matriz de costos
    File.open('ae_files/costos.txt', 'w') do |file|
      for i in 0..(cantidad_marcadores - 1) do
        for j in 0..(cantidad_marcadores - 1) do
          file.write @matriz_costos[i][j]
          file.write ' '
        end
        file.write "\n"
      end
    end

    # Renderizamos la nueva pagina
    respond_to do |format|
      format.js {
        render text: 'window.location.replace("/show_data");'
      }
    end
  end

end
