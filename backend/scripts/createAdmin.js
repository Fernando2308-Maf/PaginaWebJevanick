const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '../.env') });

const mongoose = require('mongoose');
const User = require(path.join(__dirname, '../models/User'));

const createAdminUser = async () => {
  try {
    console.log('🔗 Conectando a MongoDB...');
    console.log('URI:', process.env.MONGODB_URI);

    await mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    console.log('✅ Conectado a MongoDB');

    // Verificar si el admin ya existe
    const adminExists = await User.findOne({ email: 'admin@jevanick.com' });
    if (adminExists) {
      console.log('⚠️  El admin ya existe. Eliminando para crear uno nuevo...');
      await User.deleteOne({ email: 'admin@jevanick.com' });
    }

    // Crear usuario admin
    console.log('👤 Creando usuario admin...');
    const adminUser = new User({
      name: 'Administrador JEVANICK',
      email: 'admin@jevanick.com',
      password: 'admin123456',
      phone: '6671234567',
      role: 'admin',
      status: 'active',
    });

    await adminUser.save();

    console.log('\n');
    console.log('╔════════════════════════════════════════════╗');
    console.log('║  ✅ USUARIO ADMIN CREADO EXITOSAMENTE     ║');
    console.log('╠════════════════════════════════════════════╣');
    console.log('║  📧 Email: admin@jevanick.com             ║');
    console.log('║  🔑 Contraseña: admin123456               ║');
    console.log('║  👤 Rol: Administrador                    ║');
    console.log('╚════════════════════════════════════════════╝');
    console.log('\n⚠️  IMPORTANTE: Cambia esta contraseña después de iniciar sesión\n');

    await mongoose.connection.close();
    process.exit(0);
  } catch (error) {
    console.error('\n❌ ERROR:', error.message);
    console.error(error);
    process.exit(1);
  }
};

createAdminUser();
