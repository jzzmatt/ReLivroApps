import {demoUuid} from "./demo-uuid";

export type DemoUserSpec = {
  key: string;
  email: string;
  displayName: string;
  city: string;
  municipality: string;
  school: string;
  role: "user" | "admin" | "moderator";
  bio: string;
};

export const DEMO_USERS: DemoUserSpec[] = [
  {
    key: "admin",
    email: "admin.demo@demo.example.com",
    displayName: "Admin Demo",
    city: "Luanda",
    municipality: "Talatona",
    school: "Escola Demo Admin",
    role: "admin",
    bio: "Conta de administração apenas para ambiente de demonstração.",
  },
  {
    key: "ana",
    email: "ana.manuel@demo.example.com",
    displayName: "Ana Manuel",
    city: "Luanda",
    municipality: "Viana",
    school: "Escola Primária Kilamba",
    role: "user",
    bio: "Estudante do 5º ano — procura manuais em bom estado.",
  },
  {
    key: "carlos",
    email: "carlos.domingos@demo.example.com",
    displayName: "Carlos Domingos",
    city: "Benguela",
    municipality: "Lobito",
    school: "Colégio do Lobito",
    role: "user",
    bio: "Pai de dois estudantes — vende e troca livros usados.",
  },
  {
    key: "maria",
    email: "maria.joao@demo.example.com",
    displayName: "Maria João",
    city: "Huambo",
    municipality: "Huambo",
    school: "Escola Comandante Bula",
    role: "user",
    bio: "Frequente no marketplace — responde rápido às mensagens.",
  },
  {
    key: "pedro",
    email: "pedro.neto@demo.example.com",
    displayName: "Pedro Neto",
    city: "Luanda",
    municipality: "Kilamba",
    school: "Escola 3020",
    role: "user",
    bio: "Vendedor ocasional de manuais do primário.",
  },
  {
    key: "helena",
    email: "helena.costa@demo.example.com",
    displayName: "Helena Costa",
    city: "Lubango",
    municipality: "Lubango",
    school: "Instituto Médio do Lubango",
    role: "user",
    bio: "Interessada em trocas de livros de ciências.",
  },
  {
    key: "joao",
    email: "joao.miguel@demo.example.com",
    displayName: "João Miguel",
    city: "Luanda",
    municipality: "Benfica",
    school: "Escola Benfica Sul",
    role: "user",
    bio: "Compra manuais para o 3º ano.",
  },
  {
    key: "teresa",
    email: "teresa.fernandes@demo.example.com",
    displayName: "Teresa Fernandes",
    city: "Benguela",
    municipality: "Benguela",
    school: "Escola 12 de Outubro",
    role: "user",
    bio: "Partilha livros entre famílias da escola.",
  },
  {
    key: "rui",
    email: "rui.sequeira@demo.example.com",
    displayName: "Rui Sequeira",
    city: "Luanda",
    municipality: "Cacuaco",
    school: "Escola do Cacuaco",
    role: "user",
    bio: "Procura ofertas e livros a preços acessíveis.",
  },
  {
    key: "lucia",
    email: "lucia.pereira@demo.example.com",
    displayName: "Lúcia Pereira",
    city: "Luanda",
    municipality: "Talatona",
    school: "Colégio Privado Talatona",
    role: "user",
    bio: "Vendedora frequente — vários anúncios activos.",
  },
  {
    key: "miguel",
    email: "miguel.santos@demo.example.com",
    displayName: "Miguel Santos",
    city: "Lobito",
    municipality: "Lobito",
    school: "Escola do Lobito Centro",
    role: "user",
    bio: "Vendedor frequente — especializado em matemática.",
  },
  {
    key: "ines",
    email: "ines.alves@demo.example.com",
    displayName: "Inês Alves",
    city: "Huambo",
    municipality: "Huambo",
    school: "Escola Primária Huambo",
    role: "user",
    bio: "Publica livros de tempos em tempos.",
  },
  {
    key: "paulo",
    email: "paulo.ribeiro@demo.example.com",
    displayName: "Paulo Ribeiro",
    city: "Luanda",
    municipality: "Viana",
    school: "Escola Viana Parque",
    role: "user",
    bio: "Vendedor ocasional — prefere troca.",
  },
  {
    key: "sandra",
    email: "sandra.lopes@demo.example.com",
    displayName: "Sandra Lopes",
    city: "Luanda",
    municipality: "Kilamba",
    school: "Escola Kilamba Nova",
    role: "user",
    bio: "Mãe e vendedora de manuais usados.",
  },
  {
    key: "antonio",
    email: "antonio.vieira@demo.example.com",
    displayName: "António Vieira",
    city: "Benguela",
    municipality: "Lobito",
    school: "Escola Lobito Norte",
    role: "user",
    bio: "Compra livros para o 6º ano.",
  },
];

export function demoUserId(key: string): string {
  return demoUuid("user", key);
}
