// seeders/admin-seeder.js
import bcrypt from 'bcrypt';
import { sequelize, User, City, Subcity, Servicetype } from '../models/indexs.js';

const createAdminUser = async () => {
    try {
        // First, check if cities exist, if not create them
        let addisAbaba = await City.findOne({ where: { Name: 'Addis Ababa' } });
        if (!addisAbaba) {
            addisAbaba = await City.create({ Name: 'Addis Ababa', isActive: true });
            console.log('✅ Created City: Addis Ababa');
        }

        // Create subcity if needed
        let bole = await Subcity.findOne({ where: { Name: 'Bole', cityId: addisAbaba.id } });
        if (!bole) {
            bole = await Subcity.create({ Name: 'Bole', cityId: addisAbaba.id, isActive: true });
            console.log('✅ Created Subcity: Bole');
        }

        // Create service type if needed
        let servicetype = await Servicetype.findOne({ where: { Name: 'Property' } });
        if (!servicetype) {
            servicetype = await Servicetype.create({ 
                Name: 'Property', 
                Category: 'both', 
                isActive: true 
            });
            console.log('✅ Created ServiceType: Property');
        }

        // Check if admin already exists
        const adminExists = await User.findOne({ where: { Role: 'admin' } });
        
        if (adminExists) {
            console.log('⚠️ Admin user already exists!');
            console.log(`   Name: ${adminExists.name}`);
            return;
        }

        // Create admin user with raw password; hashing happens in User model hook
        const admin = await User.create({
            name: 'Super Admin',
            phone: '0911222333',
            password: '0911222333',
            Role: 'admin',
            isActive: true,
            ServicetypeId: servicetype.id,
            cityId: addisAbaba.id,
            subcityId: bole.id
        });

        console.log('\n✅ Admin User Created Successfully!');
        console.log('=====================================');
        console.log('🔑 Password: Admin@123');
        console.log('=====================================\n');

    } catch (error) {
        console.error('❌ Error creating admin:', error.message);
    }
};

// Run the seeder
const run = async () => {
    try {
        await sequelize.authenticate();
        console.log('✅ Database connected\n');
        await createAdminUser();
        process.exit(0);
    } catch (error) {
        console.error('❌ Database error:', error.message);
        process.exit(1);
    }
};

run();