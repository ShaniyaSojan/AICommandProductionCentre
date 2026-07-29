import { createContext, useContext, useState } from 'react'
import type { ReactNode } from 'react'

interface ProjectContextType {
  selectedProject: string
  setSelectedProject: (p: string) => void
}

const ProjectContext = createContext<ProjectContextType>({
  selectedProject: '',
  setSelectedProject: () => {},
})

export function ProjectProvider({ children }: { children: ReactNode }) {
  const [selectedProject, setSelectedProject] = useState('')
  return (
    <ProjectContext.Provider value={{ selectedProject, setSelectedProject }}>
      {children}
    </ProjectContext.Provider>
  )
}

export const useProject = () => useContext(ProjectContext)
