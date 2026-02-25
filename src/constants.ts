import type { CategoryGroup } from './types';

export const CATEGORY_GROUPS: CategoryGroup[] = [
  {
    label: 'Condensed Matter',
    categories: [
      { id: 'cond-mat.mes-hall', name: 'Mesoscale and Nanoscale Physics' },
      { id: 'cond-mat.mtrl-sci', name: 'Materials Science' },
      { id: 'cond-mat.str-el', name: 'Strongly Correlated Electrons' },
      { id: 'cond-mat.supr-con', name: 'Superconductivity' },
      { id: 'cond-mat.soft', name: 'Soft Condensed Matter' },
      { id: 'cond-mat.stat-mech', name: 'Statistical Mechanics' },
      { id: 'cond-mat.dis-nn', name: 'Disordered Systems' },
      { id: 'cond-mat.quant-gas', name: 'Quantum Gases' },
      { id: 'cond-mat.other', name: 'Other Condensed Matter' },
    ],
  },
  {
    label: 'Physics',
    categories: [
      { id: 'quant-ph', name: 'Quantum Physics' },
      { id: 'physics.optics', name: 'Optics' },
      { id: 'physics.app-ph', name: 'Applied Physics' },
      { id: 'physics.atom-ph', name: 'Atomic Physics' },
      { id: 'physics.comp-ph', name: 'Computational Physics' },
      { id: 'hep-th', name: 'High Energy Physics - Theory' },
      { id: 'hep-ex', name: 'High Energy Physics - Experiment' },
      { id: 'astro-ph', name: 'Astrophysics' },
      { id: 'gr-qc', name: 'General Relativity' },
      { id: 'nucl-th', name: 'Nuclear Theory' },
    ],
  },
  {
    label: 'Computer Science',
    categories: [
      { id: 'cs.AI', name: 'Artificial Intelligence' },
      { id: 'cs.CL', name: 'Computation and Language' },
      { id: 'cs.CV', name: 'Computer Vision' },
      { id: 'cs.LG', name: 'Machine Learning' },
      { id: 'cs.RO', name: 'Robotics' },
      { id: 'cs.NE', name: 'Neural and Evolutionary Computing' },
      { id: 'cs.CR', name: 'Cryptography and Security' },
      { id: 'cs.DS', name: 'Data Structures and Algorithms' },
    ],
  },
  {
    label: 'Mathematics',
    categories: [
      { id: 'math.MP', name: 'Mathematical Physics' },
      { id: 'math-ph', name: 'Mathematical Physics (alt)' },
      { id: 'math.AG', name: 'Algebraic Geometry' },
      { id: 'math.QA', name: 'Quantum Algebra' },
      { id: 'math.PR', name: 'Probability' },
      { id: 'math.CO', name: 'Combinatorics' },
    ],
  },
  {
    label: 'Other',
    categories: [
      { id: 'eess.SP', name: 'Signal Processing' },
      { id: 'eess.IV', name: 'Image and Video Processing' },
      { id: 'stat.ML', name: 'Machine Learning (Statistics)' },
      { id: 'q-bio.BM', name: 'Biomolecules' },
    ],
  },
];
