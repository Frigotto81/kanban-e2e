import { defineConfig } from 'cypress'

export default defineConfig({
  e2e: {
    baseUrl: 'https://kanban-dusky-five.vercel.app',  // URL base da sua aplicação alvo
    supportFile: 'cypress/support/e2e.js',            // arquivo de suporte esperado pelo Cypress
    specPattern: 'cypress/e2e/**/*.cy.js',            // padrão para os arquivos de teste
    setupNodeEvents(on, config) {
      // Caso precise, aqui podemos configurar eventos Cypress
    },
  },
})
