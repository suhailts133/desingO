type Role = "Customer" | "Admin" | "Designer"

declare global {
    namespace Express {
        interface Request {
            user?: {
                email: string;
                userId: string;
                role: Role;
                name: string
            }
        }

        namespace Multer {
            interface File {
                path: string        
                filename: string    
            }
        }
    }
}

export { }