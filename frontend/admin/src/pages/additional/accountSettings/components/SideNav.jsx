import { SECTIONS } from '../constants/navigation'

export function SideNav({ activeSection, setActiveSection }) {
  return (
    <div className="w-64 border-r bg-card">
      <nav className="space-y-1 p-4">
        {SECTIONS.map(section => {
          const Icon = section.icon
          return (
            <button
              key={section.id}
              onClick={() => setActiveSection(section.id)}
              className={`
                w-full flex items-center space-x-3 px-4 py-2.5 text-sm font-medium rounded-lg
                ${activeSection === section.id 
                  ? 'bg-primary text-primary-foreground' 
                  : 'text-muted-foreground hover:bg-accent hover:text-accent-foreground'}
              `}
            >
              <Icon className="h-5 w-5" />
              <span>{section.label}</span>
            </button>
          )
        })}
      </nav>
    </div>
  )
} 