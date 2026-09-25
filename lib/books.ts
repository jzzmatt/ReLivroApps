export type Book={id:string;title:string;subject:string;grade:string;condition:string;price:number;location:string;seller:string;mode:"Venda"|"Troca"|"Oferta";accent:string;};

export const books:Book[]=[
{id:"mat-10",title:"Matemática 10ª Classe",subject:"Matemática",grade:"10ª Classe",condition:"Bom estado",price:8000,location:"Lobito",seller:"João Silva",mode:"Venda",accent:"blue"},
{id:"port-9",title:"Português 9ª Classe",subject:"Português",grade:"9ª Classe",condition:"Muito bom",price:6500,location:"Benguela",seller:"Ana Manuel",mode:"Venda",accent:"orange"},
{id:"fis-11",title:"Física 11ª Classe",subject:"Física",grade:"11ª Classe",condition:"Usado",price:9000,location:"Luanda",seller:"Carlos António",mode:"Troca",accent:"green"},
{id:"bio-10",title:"Biologia 10ª Classe",subject:"Biologia",grade:"10ª Classe",condition:"Bom estado",price:7000,location:"Lobito",seller:"Marta Pedro",mode:"Venda",accent:"purple"},
{id:"hist-8",title:"História 8ª Classe",subject:"História",grade:"8ª Classe",condition:"Como novo",price:5500,location:"Catumbela",seller:"Pedro José",mode:"Venda",accent:"yellow"},
{id:"geo-12",title:"Geografia 12ª Classe",subject:"Geografia",grade:"12ª Classe",condition:"Bom estado",price:10000,location:"Luanda",seller:"Sofia Luís",mode:"Troca",accent:"red"},
];