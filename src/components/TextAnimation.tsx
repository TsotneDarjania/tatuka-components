'use client'

import { useEffect, useState } from 'react'
import { TextAnimationCustomProps, TextAnimationProps, textAnimationDefaultProps } from '../types/component-types'
import { calculatePercentage, getRandomNumber } from '../utils/math'
import Symbol from './components/Symbol'
import React from 'react'

function TextAnimation({
  text,
  customOptions,
  onAnimationEnd,
}: {
  text: string
  customOptions?: TextAnimationCustomProps
  onAnimationEnd?: () => void
}) {
  const options: TextAnimationProps = {
    ...textAnimationDefaultProps,
    ...customOptions,
  }

  const animationDelayTimes: number[] = []
  let time = 0

  //check pharametres validation
  if (options.speed > 100 || options.speed < 0) {
    throw new Error('options Speed pharameter should be only number from 0 to 100')
  }

  function generateAnimationDelayTimes() {
    for (let i = 0; i < text.length; i++) {
      if (text[i] !== ' ') {
        options.reverse ? animationDelayTimes.unshift(time) : animationDelayTimes.push(time)

        time += calculatePercentage(100 - options.speed, options.symbolAnimationTime)
      }
    }
  }

  function generateWords() {
    let animationDelayIndex = -1
    const randomAnimationTimesMap = new Map()
    generateAnimationDelayTimes()

    return text.split(' ').map((word, index) => (
      <ul key={index} className='symbols-list flex'>
        {word.split('').map((character) => {
          const color = options.colors[getRandomNumber(0, options.colors.length - 1)]
          animationDelayIndex += 1
          let animationDelay = 0
          if (options.style === 'domino') animationDelay = animationDelayTimes[animationDelayIndex]
          if (options.style === 'random') {
            let randomNumber = getRandomNumber(0, animationDelayTimes.length - 1)
            while (randomAnimationTimesMap.has(randomNumber)) {
              randomNumber = getRandomNumber(0, animationDelayTimes.length - 1)
            }

            randomAnimationTimesMap.set(randomNumber, randomNumber)

            animationDelay = animationDelayTimes[randomNumber]
          }
          if (typeof window === 'undefined') {
            return null
          }
          return (
            <Symbol
              onAnimationEnd={(anim) => {
                if (anim.currentTarget.style.animationDelay === `${String(Math.max(...animationDelayTimes))}s`) {
                  if (typeof onAnimationEnd === 'function') {
                    onAnimationEnd()
                  }
                }
              }}
              color={color}
              key={`${index}_symbol_${animationDelay}_${String(Math.random())}`}
              fontSize={options.fontSize}
              symbol={character}
              animationDelay={animationDelay}
              animationDuration={options.symbolAnimationTime}
            />
          )
        })}
      </ul>
    ))
  }

  const [isRendered, setIsRendered] = useState(Boolean)

  useEffect(() => {
    setIsRendered(true)
  }, [])

  return (
    <div style={{ gap: options.spacingWords }} className='flex flex-wrap '>
      {isRendered && generateWords()}
    </div>
  )
}

export default React.memo(TextAnimation)
