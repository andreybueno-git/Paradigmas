'use client';
// =========================
// LISTA DE INSTRUTORES
// =========================
//
// Porte de js/instrutores.js. Substitui o div.lista-instrutores#listaInstrutores, que antes era
// preenchido com innerHTML. O HTML estático sai com o mesmo "Carregando instrutores..." (spinner)
// do original; os grupos aparecem depois que os dados chegam (cache do localStorage ou Supabase,
// via carregarDadosInstrutores de @/lib/dados).
//
// Estados (mesmos textos do original):
// - carregando: spinner + "Carregando instrutores...";
// - vazio: "Nenhum instrutor encontrado." (também quando o Supabase falha sem cache, porque
//   carregarDados devolve uma lista vazia em vez de lançar);
// - erro: "Erro ao carregar os instrutores." (exceção ao ler os dados ou ao agrupar);
// - pronto: um section.grupo-curso por curso.
//
// Sair da página antes da resposta só descarta o resultado (flag `ativo`); não há timers nem
// ouvintes para desfazer. No StrictMode a busca roda duas vezes e a primeira é ignorada.
import { useEffect, useState } from 'react';
import { carregarDadosInstrutores } from '@/lib/dados';
import { agruparInstrutores } from './agruparInstrutores';
import CardInstrutor from './CardInstrutor';

const CARREGANDO = { tipo: 'carregando' };

export default function ListaInstrutores() {
  const [estado, setEstado] = useState(CARREGANDO);

  useEffect(() => {
    let ativo = true;

    async function carregarInstrutores() {
      try {
        const ministrantes = await carregarDadosInstrutores();

        if (!ativo) {
          return;
        }

        if (!ministrantes || ministrantes.length === 0) {
          setEstado({ tipo: 'vazio' });

          return;
        }

        /*
         * Agrupa os instrutores pelo curso
         */

        setEstado({ tipo: 'pronto', grupos: agruparInstrutores(ministrantes) });
      } catch (erro) {
        if (!ativo) {
          return;
        }

        console.error('Erro ao carregar instrutores:', erro);

        setEstado({ tipo: 'erro' });
      }
    }

    carregarInstrutores();

    return () => {
      ativo = false;
    };
  }, []);

  return (
    <div className="lista-instrutores" id="listaInstrutores">
      {estado.tipo === 'carregando' && (
        <div className="estado-instrutores">
          <span className="carregando"></span>

          <p>Carregando instrutores...</p>
        </div>
      )}

      {estado.tipo === 'vazio' && (
        <div className="estado-instrutores">
          <p>Nenhum instrutor encontrado.</p>
        </div>
      )}

      {estado.tipo === 'erro' && (
        <div className="estado-instrutores">
          <p>Erro ao carregar os instrutores.</p>
        </div>
      )}

      {estado.tipo === 'pronto' &&
        estado.grupos.map(({ curso, instrutores }) => (
          <section className="grupo-curso" key={curso}>
            <div className="titulo-curso">
              <span>CURSO</span>

              <h2>{curso}</h2>
            </div>

            <div className="lista-curso">
              {/* A lista não muda depois de carregada: a posição serve de chave. */}
              {instrutores.map((instrutor, indice) => (
                <CardInstrutor key={indice} nome={instrutor.nome} foto={instrutor.foto} curso={curso} />
              ))}
            </div>
          </section>
        ))}
    </div>
  );
}
