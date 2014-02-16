class Api::QueriesController < Api::ApiController

  TRAVEL_MODE = 'driving'

  prepend_before_filter :crear_array_distancias_desde_data_mobile,  only: [ :create ]
  before_filter :crear_matriz_de_distancias,                        only: [ :create ]
  append_before_filter :crear_matriz_de_costos,                     only: [ :create ]

  #
  # El algoritmo evolutivo necesita de 4 parametros para funcionar.
  #   - La ruta del archivo binario a ser ejecutado.
  #   - La ruta del archivo de configuración paramétrica.
  #   - La ruta del archivo de parámetros específicos.
  #   - La ruta de la solución.
  #
  # Además, utilizamos un comando para filtrar resultados y brindamos los
  # mismos de forma amigable.
  #
  def create

    # Creamos y almacenamos la entidad de query
    @query = Query.create(
        cantidad_marcadores:  cantidad_marcadores,
        tipo_tarifa:          tipo_tarifa,
        user:                 nil,
        distancias:           @matriz_distancias,
        costos:               @matriz_costos,
        shared:               true
    )

    # Ejecutamos el algoritmo evolutivo
    FileUtils.mkdir_p('public/' + @query.id.to_s)
    IO.popen("bin/genetic_algorithm #{ archivo_de_configuracion } #{ archivo_de_parametros } #{ archivo_de_solucion } | grep ^Solution: > #{ archivo_simplificado }")

    while !query_end?
      sleep(1)
    end

    # Leemos la solucion
    archivo_solucion = File.open(archivo_simplificado)
    solucion = archivo_solucion.readline
    archivo_solucion.close

    taxis = taxis(solucion)


    fake_json_response = {
        tipo_tarifa: @query.tipo_tarifa,
        costo_total: costo_total(solucion),
        cant_taxis: taxis.length.to_s,
        cant_destinos: (@query.cantidad_marcadores - 1).to_s,
        query_id: @query.id.to_s,
        taxis: taxis
    }

    render json: fake_json_response.to_json
  end


  private

  def query_end?
    File.size(archivo_simplificado) != 0
  rescue
    return false
  end

  def taxis(solucion)
    taxis_string = solucion.split(':')[1]
    taxis_string = taxis_string[2, taxis_string.length - 9]

    taxis = Array.new
    current_taxi = Array.new

    for i in 0..taxis_string.length - 1 do
      if taxis_string[i] != ' '
        if taxis_string[i] == '0'
          unless i>0 && taxis_string[i-1] != ' '
            taxis.push(current_taxi) if current_taxi.length > 0
            current_taxi = Array.new
          else
            pasajero = (current_taxi.pop + taxis_string[i])
            current_taxi.push(pasajero)
          end
        else
          if i>0 && taxis_string[i-1] != ' '
            pasajero = (current_taxi.pop + taxis_string[i])
            current_taxi.push(pasajero)
          else
            current_taxi.push(taxis_string[i])
          end
        end
      end
    end
    taxis.push(current_taxi) if current_taxi.length > 0

    taxis
  end

  def costo_total(solucion)
    solucion.split(': ')[2].gsub("\n", '')
  end

  def archivo_de_configuracion
    @archivo_configuracion ||= AE_CONFIG['archivo_de_configuracion']
  end

  def archivo_de_solucion
    @archivo_solucion ||= 'public/' + @query.id.to_s + AE_CONFIG['archivo_de_solucion']
  end

  def archivo_simplificado
    @archivo_simplificado ||= 'public/' + @query.id.to_s + AE_CONFIG['archivo_simplificado']
  end

  def tipo_tarifa
    @tipo_tarifa ||= params[:tipo_tarifa]
  end

  def cantidad_marcadores
    @cantidad_marcadores ||= params[:marcadores].size
  end

  def crear_array_distancias_desde_data_mobile
    @arreglo_marcadores = Array.new

    for i in 0..cantidad_marcadores - 1 do
      distancias_a_previos = Array.new
      for j in 0..i do
        if j != i
          host ='https://maps.googleapis.com/maps/api/distancematrix/json?'
          parameters = {
              origins:        "#{params[:marcadores][i]['latitude']},#{params[:marcadores][i]['longitude']}",
              destinations:   "#{params[:marcadores][j]['latitude']},#{params[:marcadores][j]['longitude']}",
              mode:           TRAVEL_MODE,
              sensor:         'false'
          }

          http_response = HTTParty.get(host + parameters.to_param)
          json_response = JSON[http_response.body]
          if json_response['status'] == 'OK'
            distancias_a_previos.push(json_response['rows'][0]['elements'][0]['distance']['value'])
          else
            # Handle error
          end
        end
      end
      @arreglo_marcadores.push(distancias_a_previos)
    end
  end

  #
  # Toma un arreglo de distancias y crear una matriz de distancias propiamente armada.
  #
  def crear_matriz_de_distancias
    distancias = @arreglo_marcadores

    # Matriz de distancias
    @matriz_distancias  = Array.new(cantidad_marcadores) { Array.new(cantidad_marcadores) }

    # Rellenamos la matriz de distancias
    for i in 0..cantidad_marcadores - 1 do
      @matriz_distancias[i][i] = 0
      for j in 0..i do
        @matriz_distancias[i][j] = distancias[i][j] if i != j
        @matriz_distancias[j][i] = distancias[i][j] if i != j
      end
    end
  end

  #
  # Toma una matriz de distancias y crear una matriz de costos.
  #
  def crear_matriz_de_costos

    # Matriz de costos
    @matriz_costos  = Array.new(cantidad_marcadores) { Array.new(cantidad_marcadores) }

    # Rellenamos la matriz de costos
    for i in 0..(cantidad_marcadores - 1) do
      for j in 0..(cantidad_marcadores - 1) do
        if @matriz_distancias[i][j] > 100
          costo_actual = 0
          costo_actual += tipo_tarifa == 'diurna' ? (((@matriz_distancias[i][j])/100).to_i) * (CIEN_METROS_DIURNO) : (((@matriz_distancias[i][j])/100).to_i) * (CIEN_METROS_NOCTURNO)
          @matriz_costos[i][j] = costo_actual.round(3)
        else
          @matriz_costos[i][j] = 0
        end
      end
    end
  end

  #
  # El siguiente archivo posee la configuración para la
  # ejecución en particular
  # El mismo posee la siguiente estructura:
  #   5
  #   27.71
  #   0
  #   public/costos.txt
  #
  # Donde el primer lugar corresponde a la cantidad de lugares a ser rellenados
  # por el algoritmo evolutivo, el segundo al costo de la bandera y el cuarto a
  # la ubicación del archivo correspondiente a la matriz de costos.
  #
  def archivo_de_parametros
    FileUtils.touch('public/' + @query.id.to_s + AE_CONFIG['archivo_de_parametros'])

    cantidad = 2 * (cantidad_marcadores - 1) - 1

    File.open('public/' + @query.id.to_s + AE_CONFIG['archivo_de_parametros'], 'w') do |file|
      file.write cantidad
      file.write "\n"
      tipo_tarifa == 'diurna' ? (file.write BANDERA_DIURNA) : (file.write BANDERA_NOCTURNA)
      file.write "\n"
      file.write '0'
      file.write "\n"
      file.write 'public/' + @query.id.to_s + AE_CONFIG['archivo_de_costos']
    end

    # Creamos el archivo de costos
    archivo_de_costos

    'public/' + @query.id.to_s + AE_CONFIG['archivo_de_parametros']
  end

  #
  # El siguiente archivo posee una matriz de costos entre los
  # diferentes destinos que va a utilizar el algoritmo evolutivo.
  # El mismo debe tener la siguiente estructura:
  #   0 161.0 305.9 334.88
  #   161.0 0 191.59 178.71
  #   305.9 191.59 0 305.9
  #   334.88 178.71 305.9 0
  #
  def archivo_de_costos
    FileUtils.touch('public/' + @query.id.to_s + AE_CONFIG['archivo_de_costos'])

    File.open('public/' + @query.id.to_s + AE_CONFIG['archivo_de_costos'], 'w') do |file|
      for i in 0..(cantidad_marcadores - 1) do
        for j in 0..(cantidad_marcadores - 1) do
          file.write @matriz_costos[i][j]
          file.write ' '
        end
        file.write "\n"
      end
    end
  end

end