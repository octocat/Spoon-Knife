const nombres = {
  nombre: 'Juan',
  apellido: 'Perez',
  edad: 30,
  direccion: {
    ciudad: 'Bogota',
    zip: 123456,
    lat: 14.1234,
    lng: 34.1234
  },
};

const persona = { ...nombres };
persona.nombre = 'Peter';

console.log(nombres);

const carros = ['Mazda', 'Toyota', 'Honda'];

const arboles = {
  0: 'Pino',
  1: 'Roble',
  2: 'Ombu'
};

const ciudades = {
  0: 'Bogota',
  1: 'Medellin',
  2: 'Barranquilla',
  3: 'Cali',
  4: 'Cartagena',
  5: 'Bucaramanga',
  6: 'Santa Marta',
  7: 'Cucuta',
  8: 'Barrancabermeja',
  9: 'Bello',
  10: 'Soledad',
  11: 'Soacha',
  12: 'Buenaventura',
  13: 'Pereira',
  14: 'Manizales',
  15: 'Armenia',
  16: 'Valledupar',
  17: 'Monteria',
}

const paises = {
  0: 'Colombia',
  1: 'Argentina',
  2: 'Peru',
  3: 'Chile',
  4: 'Ecuador',
  5: 'Venezuela',
  6: 'Bolivia',
  7: 'Paraguay',
  8: 'Uruguay'
}