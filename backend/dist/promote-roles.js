"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
async function main() {
    const usersToUpdate = ['admin123@gmail.com', 'rifalfebiyan123@gmail.com'];
    for (const email of usersToUpdate) {
        const updatedUser = await prisma.user.update({
            where: { email },
            data: { role: 'ADMIN' },
        });
        console.log(`Updated user ${email} to ADMIN role.`);
    }
}
main()
    .catch((e) => console.error(e))
    .finally(async () => {
    await prisma.$disconnect();
});
//# sourceMappingURL=promote-roles.js.map