'use client';
// Logo do parceiro (index.html:309). É componente cliente de propósito: um <img> dentro de um
// Server Component vira uma dica de preload (HL) no payload RSC da home, e quem pré-carrega esse
// payload (o <Link href="/"> de outra página) baixaria a imagem fora da home. Assim ela só é
// baixada na home, como no original.
export default function LogoParceiro() {
  return <img src="https://i.ibb.co/nqCT8t9f/Logo.png" alt="Sua Internet" />;
}
