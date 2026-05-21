import { memo } from 'react'

const MESSAGES = [
  'Back up your files — trust me! (￣▽￣)b',
  '(•̀ᴗ•́)و Back. Up. Your. Files. Seriously, do it!',
  '(￢_￢) You backed up today, right? ...Right?',
  'щ(ಠ益ಠщ) NO BACKUP?! Friend, please—',
  '(•ω•) A little backup goes a long way, trust me~',
  '(ﾟヮﾟ) Fun fact: backups save lives. Well, files. Same thing!',
  "(๑•̀ㅂ•́๑) You're doing great! Just remember to back up every now and then.",
  "(づ￣3￣)づ Don't forget to back up your important files."
]

const RANDOM_WELCOME_MESSAGE = MESSAGES[Math.floor(Math.random() * MESSAGES.length)]

interface WelcomeScreenProps {
  onSelect: () => void
}

const WelcomeScreen = memo(({ onSelect }: WelcomeScreenProps) => {
  return (
    <div className="welcome-screen">
      <h1>Mnemora</h1>
      <p>The efficient way to organize your media galleries with a single keypress.</p>
      <em style={{ opacity: 0.5, fontSize: '0.85em' }}>{RANDOM_WELCOME_MESSAGE}</em>
      <button className="primary-button" onClick={onSelect}>
        Select Source Folder
      </button>
    </div>
  )
})

WelcomeScreen.displayName = 'WelcomeScreen'

export default WelcomeScreen
