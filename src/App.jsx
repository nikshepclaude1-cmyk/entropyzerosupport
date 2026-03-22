import { useState, useMemo } from 'react';
import './index.css';

import { LIFE_PHASES } from './constants';
import { generateCurve, enhanceCurveWithAI } from './engine';
import { Spinner } from './components/UI';

import Welcome from './screens/Welcome';
import Setup   from './screens/Setup';
import Phases  from './screens/Phases';
import Preview from './screens/Preview';

export default function App() {
  const [screen, setScreen] = useState('welcome'); // welcome | setup | phases | generating | preview
  const [mode,   setMode]   = useState('fresh');

  const [form, setForm] = useState({
    name: '', dob: '', startPrice: 500, aiKey: '',
  });

  const [selectedPhases, setSelectedPhases] = useState(
    new Set(['primary_school', 'high_school', 'college', 'early_career'])
  );
  const [phaseAnswers,   setPhaseAnswers]   = useState({});
  const [existingJson,   setExistingJson]   = useState(null);
  const [curve,          setCurve]          = useState([]);
  const [genStep,        setGenStep]        = useState('');

  // Build phase list for engine
  const phaseList = useMemo(() => {
    const birthYear = form.dob ? new Date(form.dob).getFullYear() : 2000;
    const age = new Date().getFullYear() - birthYear;
    return LIFE_PHASES
      .filter(p => p.ageStart < age && selectedPhases.has(p.id))
      .map(p => ({
        config: p,
        filled: true,
        answers: phaseAnswers[p.id] || {},
      }));
  }, [form.dob, selectedPhases, phaseAnswers]);

  const canGenerate = phaseList.length > 0 && !!form.dob && !!form.name.trim();

  const generate = async () => {
    setScreen('generating');
    setGenStep('Computing your life curve…');

    try {
      const raw = generateCurve({
        phases: phaseList,
        dob: form.dob,
        startPrice: form.startPrice,
        existingJson: mode === 'mix' ? existingJson : null,
      });

      let final = raw;

      if (form.aiKey) {
        setGenStep('AI analysing your narratives…');
        final = await enhanceCurveWithAI({
          phases: phaseList,
          curve: raw,
          dob: form.dob,
          aiKey: form.aiKey,
        });
      }

      setGenStep('Finalising…');
      await new Promise(r => setTimeout(r, 500));
      setCurve(final);
      setScreen('preview');
    } catch (e) {
      console.error(e);
      setGenStep('Error — ' + e.message);
      await new Promise(r => setTimeout(r, 2000));
      setScreen('phases');
    }
  };

  const regen = () => {
    const raw = generateCurve({
      phases: phaseList,
      dob: form.dob,
      startPrice: form.startPrice,
      existingJson: mode === 'mix' ? existingJson : null,
    });
    setCurve(raw);
  };

  if (screen === 'generating') return <Spinner text={genStep} />;

  if (screen === 'welcome') return (
    <Welcome
      mode={mode} setMode={setMode}
      onStart={() => setScreen('setup')}
    />
  );

  if (screen === 'setup') return (
    <Setup
      mode={mode} form={form} setForm={setForm}
      existingJson={existingJson} setExistingJson={setExistingJson}
      onBack={() => setScreen('welcome')}
      onNext={() => setScreen('phases')}
    />
  );

  if (screen === 'phases') return (
    <Phases
      dob={form.dob}
      selectedPhases={selectedPhases} setSelectedPhases={setSelectedPhases}
      phaseAnswers={phaseAnswers}     setPhaseAnswers={setPhaseAnswers}
      onBack={() => setScreen('setup')}
      onGenerate={generate}
      canGenerate={canGenerate}
    />
  );

  if (screen === 'preview') return (
    <Preview
      curve={curve}
      name={form.name}
      startPrice={form.startPrice}
      existingJson={existingJson}
      mode={mode}
      onEdit={() => setScreen('phases')}
      onRegenerate={regen}
    />
  );

  return null;
}
