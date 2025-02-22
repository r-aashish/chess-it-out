(async () => {
    await loadFull(tsParticles);
  
    await tsParticles.load({
      options: {
        fpsLimit: 60,
        particles: {
          groups: {
            z5000: {
              number: {
                value: 70
              },
              zIndex: {
                value: 5000
              }
            },
            z7500: {
              number: {
                value: 30
              },
              zIndex: {
                value: 75
              }
            },
            z2500: {
              number: {
                value: 50
              },
              zIndex: {
                value: 25
              }
            },
            z1000: {
              number: {
                value: 40
              },
              zIndex: {
                value: 10
              }
            }
          },
          number: {
            value: 200,
            density: {
              enable: false,
              area: 800
            }
          },
          color: {
            value: "#fff"
          },
          shape: {
            type: "circle"
          },
          opacity: {
            value: { min: 0.1, max: 0.9 }
          },
          size: {
            value: 3
          },
          move: {
            enable: true,
            speed: 2,
            direction: "right",
            straight: true,
            outModes: "out"
          },
          zIndex: {
            value: 5,
            opacityRate: 0.5
          }
        },
        interactivity: {
          events: {
            onClick: {
              enable: true,
              mode: "push"
            },
            resize: true
          }
        },
        detectRetina: true,
        background: {
          color: "#000000"
        },
        emitters: {
          position: {
            y: 55,
            x: -30
          },
          rate: {
            delay: 7,
            quantity: 1
          },
          size: {
            width: 0,
            height: 0
          },
          particles: {
            shape: {
              type: "image",
              options: {
                image: [
                  {
                    src: "images/among-us-pieces/1.png",
                    width: 100,
                    height: 100
                  },
                  {
                    src: "images/among-us-pieces/2.png",
                    width: 100,
                    height: 100
                  },
                  {
                    src: "images/among-us-pieces/3.png",
                    width: 100,
                    height: 100
                  },
                  {
                    src: "images/among-us-pieces/4.png",
                    width: 100,
                    height: 100
                  },
                  {
                    src: "images/among-us-pieces/5.png",
                    width: 100,
                    height: 100
                  },
                  {
                    src: "images/among-us-pieces/6.png",
                    width: 100,
                    height: 100
                  }
                ]
              }
            },
            opacity: {
              value: 1
            },
            size: {
              value: 70
            },
            move: {
              speed: 4,
              outModes: {
                default: "destroy",
                left: "none"
              },
              straight: true
            },
            zIndex: {
              value: 0
            },
            rotate: {
              value: {
                min: 0,
                max: 360
              },
              animation: {
                enable: true,
                speed: 7,
                sync: true
              }
            }
          }
        }
      }
    });
  })();
