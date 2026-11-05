import { ResearchPaper } from '../types';

export const PAPERS: ResearchPaper[] = [
  {
    id: 'paper-sae-mechanistic',
    title: 'Towards Monosemanticity: Decomposing Language Models With Sparse Autoencoders',
    subtitle: 'A research workspace sample on interpretability and feature superposition',
    authors: ['CognitiveFocus Research Library'],
    institution: 'Curated sample material',
    publishedDate: 'Nov 2025',
    doi: '10.48550/arXiv.2209.10652',
    readTimeMinutes: 18,
    category: 'Machine Learning',
    abstract: 'This sample paper explores feature superposition, sparse autoencoders, and methods for interpreting distributed representations in neural networks.',
    executiveSummary: {
      thesis: 'Sparse feature representations can help expose interpretable structure hidden inside distributed neural network activations.',
      coreBreakthrough: 'A structured feature space makes it easier to inspect mechanisms and compare learned representations.',
      frictionPoints: ['Feature splitting and superposition complicate interpretation.', 'Automated explanations require careful evaluation against source evidence.'],
      keyEquations: [{ label: 'Reconstruction objective', formula: 'L(x) = ||x - x_hat||² + λ||f(x)||₁', implication: 'Balances reconstruction quality with sparse latent activations.' }]
    },
    sections: [
      { id: 'sec-1', title: '1. Introduction & The Superposition Hypothesis', content: ['Neural networks can encode more features than they have independent dimensions by using superposed representations.', 'Sparse activation patterns can reduce interference between features that share representational capacity.'] },
      { id: 'sec-2', title: '2. Sparse Autoencoder Architecture', content: ['Sparse autoencoders learn a dictionary of latent features from model activations.', 'The learned features can be inspected, compared, and tested with targeted examples.'], subsections: [{ id: 'sub-2-1', title: '2.1 Mitigating Shrinkage Bias via JumpReLU', content: ['Thresholded activations can reduce shrinkage effects while preserving sparse feature selection.'], equations: ['f_i(x) = JumpReLU(z_i, θ_i)'] }] },
      { id: 'sec-3', title: '3. Evaluation & Interpretability', content: ['Feature explanations should be validated with interventions and held-out examples.', 'Quantitative interpretability scores do not replace careful qualitative review.'] },
      { id: 'sec-4', title: '4. Mathematical Bounds on Superposition Capacity', content: ['Geometric constraints and feature sparsity influence how many distinguishable directions can be represented in a fixed dimensional space.'] }
    ],
    citations: [{ id: 'cit-1', number: 1, authors: 'Elhage et al.', title: 'Toy Models of Superposition', journal: 'Transformer Circuits', year: 2022, doi: '10.48550/arXiv.2209.10652' }],
    concepts: [
      { id: 'c-1', label: 'Feature Superposition', category: 'theory', description: 'Multiple features share representational directions.', connectedTo: ['c-2'], sourceSection: '1. Introduction & The Superposition Hypothesis' },
      { id: 'c-2', label: 'Sparse Autoencoders', category: 'mechanism', description: 'A learned dictionary maps activations to sparse latent features.', connectedTo: ['c-1', 'c-3'], sourceSection: '2. Sparse Autoencoder Architecture' },
      { id: 'c-3', label: 'Interpretability Metrics', category: 'metric', description: 'Evaluation signals that estimate feature explanation quality.', connectedTo: ['c-2'], sourceSection: '3. Evaluation & Interpretability' }
    ],
    clozeItems: [
      { id: 'cloze-1', prompt: 'Sparse autoencoders aim to recover interpretable latent ____ from model activations.', missingWord: 'features', hint: 'Learned semantic units', context: 'A learned dictionary maps activations to sparse latent features.' }
    ],
    retrievalQuestions: [
      { id: 'q-1', question: 'What is the central idea behind feature superposition?', options: ['Features can share representational dimensions', 'Each feature requires a unique neuron', 'Models cannot encode sparse features', 'Attention removes all interference'], correctIndex: 0, explanation: 'Superposition allows multiple features to share directions under suitable activation patterns.', citationNumber: 1 }
    ],
    masteryPercentage: 45
  }
];
