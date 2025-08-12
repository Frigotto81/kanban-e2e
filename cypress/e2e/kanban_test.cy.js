 <reference types="cypress" />

describe('Validação Crítica da Aplicação Kanban', () => {
  const url = 'https://kanban-dusky-five.vercel.app/'

  beforeEach(() => {
    cy.viewport('macbook-15') 
    cy.visit(url)
    cy.contains('Quadro Kanban', { timeout: 10000 }).should('be.visible') 
  })

  context('1. Ortografia', () => {
    it('Corrigir erro de digitação no cartão da coluna "To Do"', () => {
      cy.contains('To Do').parent().should('not.contain.text', 'Aiustes fluxo de compra')
      cy.contains('To Do').parent().should('contain.text', 'Ajustes fluxo de compra')
    })
  })

  context('2. Contraste e Acessibilidade Visual', () => {
    it('Ícone de excluir deve ter contraste acessível e aria-label/tooltips', () => {
      const columns = ['To Do', 'In Progress', 'Done']
      columns.forEach((col) => {
        cy.contains(col).parent().within(() => {
          cy.get('button[aria-label*="excluir"], button[aria-label*="Excluir"]').should('exist').and('be.visible')
          cy.get('button[aria-label*="excluir"], button[aria-label*="Excluir"]').then(($btn) => {
            const color = $btn.css('color')
            const bgColor = $btn.parent().css('background-color')
            cy.log(`Botão excluir cor de texto ${color} em fundo ${bgColor}`)
          })
          cy.get('button[aria-label][title]').should('exist')
        })
      })
    })
  })

  context('3. Feedback visual ao criar/editar/excluir', () => {
    it('Deve mostrar toast ou mensagem ao adicionar nova tarefa e focar na tarefa', () => {
      cy.contains('To Do').parent().within(() => {
        cy.contains('+ Adicionar Tarefa').click()
        cy.get('input[placeholder="Título da tarefa"]').type('Tarefa com feedback{enter}')
      })
      cy.get('.toast, .notification, [role="alert"]').should('contain.text', /tarefa adicionada/i).and('be.visible')
      cy.contains('Tarefa com feedback').should('be.visible').and('have.focus')
    })

    it('Deve mostrar toast/mensagem ao excluir tarefa', () => {
      cy.contains('Tarefa com feedback').parent().within(() => {
        cy.get('button[aria-label*="Excluir"]').click()
      })
      cy.get('.toast, .notification, [role="alert"]').should('contain.text', /tarefa removida|excluída/i).and('be.visible')
      cy.contains('Tarefa com feedback').should('not.exist')
    })
  })

  context('4. Responsividade / Mobile', () => {
    it('Layout deve ser responsivo para mobile (375px) e permitir scroll horizontal', () => {
      cy.viewport(375, 667) 
      cy.contains('Quadro Kanban').should('be.visible')
      cy.get('.kanban-board, .board-container, [data-cy="board"]').then(($el) => {
        const el = $el[0]
        const canScrollHorizontally = el.scrollWidth > el.clientWidth
        expect(canScrollHorizontally).to.be.true
      })

      cy.get('.kanban-board, .board-container, [data-cy="board"]').should('have.css', 'scroll-snap-type')
    })
  })

  context('5. Botão alternar tema acessível', () => {
    it('Botão de alternar tema deve ter aria-label e tooltip', () => {
      cy.get('button[aria-label="Alternar tema"], button[title="Alternar tema"]').should('exist').and('be.visible')
      cy.get('button[aria-label="Alternar tema"]').should('have.attr', 'aria-pressed')
    })
  })

  context('6. Roles, Aria-labels e foco visível', () => {
    it('Todos botões e cartões devem ter aria-label/role e ter foco visível', () => {
      cy.get('button').each(($btn) => {
        expect($btn.attr('aria-label') || $btn.attr('role')).to.exist
      })
      cy.get('body').tab()
      cy.focused().should('have.css', 'outline-style').and('not.eq', 'none')
    })
  })

  context('7. Drag & Drop - funciona no desktop e tem fallback para mobile', () => {
    it('Deve arrastar tarefa To Do para In Progress no desktop', () => {
      cy.viewport(1280, 720)
      cy.contains('To Do').parent().within(() => {
        cy.contains('Ajustes fluxo de compra').should('exist')
        cy.get('[data-cy="card"]').contains('Ajustes fluxo de compra').drag('[data-cy="in-progress-column"]')
      })
      cy.get('[data-cy="in-progress-column"]').should('contain.text', 'Ajustes fluxo de compra')
    })

    it('Deve permitir mover tarefa no mobile via botão fallback', () => {
      cy.viewport('iphone-x')
      cy.contains('Ajustes fluxo de compra').parent().within(() => {
        cy.get('button[aria-label*="mover"]').should('be.visible').click()
      })
      // Espera janela/modal para mover
      cy.get('[role="dialog"]').should('exist').within(() => {
        cy.contains('In Progress').click()
        cy.get('button').contains('Confirmar').click()
      })
      cy.get('[data-cy="in-progress-column"]').should('contain.text', 'Ajustes fluxo de compra')
    })
  })

})
