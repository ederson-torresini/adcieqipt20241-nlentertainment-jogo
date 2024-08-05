export default class sala extends Phaser.Scene {
  constructor () {
    super('sala')
  }

  preload () {
    this.load.image('fundo', './assets/fundo.png')
    this.load.audio('iniciar', './assets/iniciar.mp3')
  }

  create () {
    this.iniciar = this.sound.add('iniciar')
    this.add.image(400, 375, 'fundo')
    this.salas = [
      { x: 104, y: 252, numero: '1' },
      { x: 246, y: 252, numero: '2' },
      { x: 388, y: 252, numero: '3' },
      { x: 530, y: 252, numero: '4' },
      { x: 672, y: 252, numero: '5' },
      { x: 104, y: 458, numero: '6' },
      { x: 246, y: 458, numero: '7' },
      { x: 388, y: 458, numero: '8' },
      { x: 530, y: 458, numero: '9' },
      { x: 662, y: 458, numero: '10' }
    ]

    // Para cada sala, adiciona o botão de seleção
    this.salas.forEach(sala => {
      sala.texto = this.add.text(sala.x, sala.y, sala.numero, {
        fontSize: '38px',
        fill: '#FFFFFF',
        fontFamily: 'Courier New'
      })
        .setInteractive()
        .on('pointerdown', () => {
          // Remove os textos das salas
          this.salas.forEach(sala => {
            sala.texto.destroy()
          })

          // Toca o som de início
          this.iniciar.play()

          // Define a variável global da sala
          globalThis.game.sala = sala.numero

          // Emite o evento 'entrar-na-sala' para o servidor
          globalThis.game.socket.emit('entrar-na-sala', globalThis.game.sala)
        })
    })


    // Define o evento de recebimento da mansagem 'jogadores'
    globalThis.game.socket.on('jogadores', (jogadores) => {
      // Se o segundo jogador já estiver conectado, inicia o jogo
      if (jogadores.segundo) {
        // Apresenta texto na tela
        //this.mensagem.setText('Conectando...')

        // Define a variável global dos jogadores
        globalThis.game.jogadores = jogadores

        // Para a cena atual e inicia a cena do mapa
        this.scene.stop('sala')
        this.scene.start('mapa')
      } else if (jogadores.primeiro) {
        // Se o primeiro jogador já estiver conectado, aguarda o segundo
        this.mensagem.setText('Aguardando segundo jogador...')
      }
    })
  }
}