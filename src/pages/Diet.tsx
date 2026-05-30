import { useState, useRef, useEffect } from 'react';
import { ChevronDown, ChevronUp, Droplets, Plus, X, Camera, Barcode, Search, Trash2 } from 'lucide-react';
import { useStore } from '../store/useStore';
import { calcTargetCalories, calcMacros } from '../utils/calculations';
import { getMealPlanForGoal } from '../data/diet';
import type { FoodItem, LoggedFoodItem } from '../types';

// ─── Simulated AI food detection results ──────────────────────────────────────
const aiFoods: FoodItem[][] = [
  [
    { name: 'Grilled Chicken Breast', portion: '180g', cal: 297, p: 56, c: 0, f: 6 },
    { name: 'Brown Rice', portion: '150g', cal: 165, p: 4, c: 34, f: 1 },
    { name: 'Steamed Broccoli', portion: '100g', cal: 35, p: 3, c: 7, f: 0 },
  ],
  [
    { name: 'Avocado Toast', portion: '1 slice', cal: 210, p: 5, c: 22, f: 12 },
    { name: 'Poached Egg', portion: '50g', cal: 72, p: 6, c: 0, f: 5 },
  ],
  [
    { name: 'Greek Yogurt', portion: '170g', cal: 100, p: 17, c: 6, f: 0 },
    { name: 'Mixed Berries', portion: '80g', cal: 46, p: 1, c: 11, f: 0 },
    { name: 'Granola', portion: '30g', cal: 130, p: 3, c: 20, f: 5 },
  ],
  [
    { name: 'Salmon Fillet', portion: '150g', cal: 280, p: 39, c: 0, f: 13 },
    { name: 'Sweet Potato', portion: '150g', cal: 129, p: 2, c: 30, f: 0 },
  ],
];

// ─── Simulated barcode food database ──────────────────────────────────────────
const barcodeDb: FoodItem[] = [
  { name: 'Oat Milk (Oatly)', portion: '250ml', cal: 120, p: 3, c: 16, f: 5 },
  { name: 'Protein Bar (Quest)', portion: '60g', cal: 200, p: 21, c: 22, f: 7 },
  { name: 'Almond Butter (Justin\'s)', portion: '32g', cal: 190, p: 7, c: 7, f: 17 },
  { name: 'Greek Yogurt (Chobani)', portion: '170g', cal: 90, p: 15, c: 6, f: 0 },
  { name: 'Whey Protein (Optimum)', portion: '30g', cal: 120, p: 24, c: 3, f: 1 },
  { name: 'Banana (Dole)', portion: '120g', cal: 107, p: 1, c: 27, f: 0 },
  { name: 'Whole Milk (Horizon)', portion: '240ml', cal: 150, p: 8, c: 12, f: 8 },
  { name: 'Cliff Bar (Chocolate)', portion: '68g', cal: 250, p: 9, c: 44, f: 6 },
  { name: 'Cottage Cheese (Breakstone)', portion: '113g', cal: 90, p: 13, c: 5, f: 2 },
  { name: 'Salmon (Wild Planet)', portion: '85g', cal: 130, p: 23, c: 0, f: 4 },
];

function MacroRing({ value, max, color, label, unit = 'g' }: { value: number; max: number; color: string; label: string; unit?: string }) {
  const r = 32;
  const circ = 2 * Math.PI * r;
  const pct = Math.min(1, value / max);
  const offset = circ * (1 - pct);
  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4 }}>
      <div style={{ position: 'relative', width: 80, height: 80 }}>
        <svg width={80} height={80} viewBox="0 0 80 80" style={{ transform: 'rotate(-90deg)' }}>
          <circle cx={40} cy={40} r={r} fill="none" stroke="#f1f5f9" strokeWidth={8} />
          <circle
            cx={40} cy={40} r={r} fill="none" stroke={color} strokeWidth={8}
            strokeDasharray={circ} strokeDashoffset={offset} strokeLinecap="round"
            style={{ transition: 'stroke-dashoffset 0.6s ease' }}
          />
        </svg>
        <div style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
          <div style={{ fontSize: 14, fontWeight: 800, color: '#111827' }}>{value}</div>
          <div style={{ fontSize: 9, color: '#94a3b8' }}>{unit}</div>
        </div>
      </div>
      <div style={{ fontSize: 12, fontWeight: 600, color: color }}>{label}</div>
      <div style={{ fontSize: 11, color: '#94a3b8' }}>of {max}{unit}</div>
    </div>
  );
}

function FoodRow({ food, onRemove }: { food: FoodItem; onRemove?: () => void }) {
  return (
    <div style={{
      display: 'flex', alignItems: 'center', padding: '10px 0',
      borderBottom: '1px solid #f8fafc',
    }}>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ fontSize: 14, fontWeight: 600, color: '#111827' }}>{food.name}</div>
        <div style={{ fontSize: 12, color: '#94a3b8', marginTop: 1 }}>{food.portion}</div>
      </div>
      <div style={{ display: 'flex', gap: 10, fontSize: 12 }}>
        <div style={{ textAlign: 'center', minWidth: 32 }}>
          <div style={{ fontWeight: 700, color: '#6366f1' }}>{food.p}g</div>
          <div style={{ color: '#94a3b8', fontSize: 10 }}>P</div>
        </div>
        <div style={{ textAlign: 'center', minWidth: 32 }}>
          <div style={{ fontWeight: 700, color: '#f59e0b' }}>{food.c}g</div>
          <div style={{ color: '#94a3b8', fontSize: 10 }}>C</div>
        </div>
        <div style={{ textAlign: 'center', minWidth: 32 }}>
          <div style={{ fontWeight: 700, color: '#10b981' }}>{food.f}g</div>
          <div style={{ color: '#94a3b8', fontSize: 10 }}>F</div>
        </div>
        <div style={{ textAlign: 'center', minWidth: 38 }}>
          <div style={{ fontWeight: 700, color: '#ef4444' }}>{food.cal}</div>
          <div style={{ color: '#94a3b8', fontSize: 10 }}>kcal</div>
        </div>
      </div>
      {onRemove && (
        <button onClick={onRemove} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#ef4444', marginLeft: 8, padding: 4 }}>
          <Trash2 size={14} />
        </button>
      )}
    </div>
  );
}

// ─── AI Scan Modal ─────────────────────────────────────────────────────────────
function AIScanModal({ onAdd, onClose }: { onAdd: (food: FoodItem) => void; onClose: () => void }) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const [phase, setPhase] = useState<'scanning' | 'detected'>('scanning');
  const [detected, setDetected] = useState<FoodItem[]>([]);

  useEffect(() => {
    let timer: ReturnType<typeof setTimeout>;
    navigator.mediaDevices?.getUserMedia({ video: { facingMode: 'environment' } })
      .then(stream => {
        streamRef.current = stream;
        if (videoRef.current) videoRef.current.srcObject = stream;
      }).catch(() => {});

    timer = setTimeout(() => {
      const group = aiFoods[Math.floor(Math.random() * aiFoods.length)];
      setDetected(group);
      setPhase('detected');
    }, 3000);

    return () => {
      clearTimeout(timer);
      streamRef.current?.getTracks().forEach(t => t.stop());
    };
  }, []);

  const pick = (food: FoodItem) => {
    onAdd(food);
    onClose();
  };

  return (
    <div style={{
      position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.92)', zIndex: 2000,
      display: 'flex', flexDirection: 'column',
    }}>
      <div style={{ padding: '52px 20px 12px', display: 'flex', alignItems: 'center', gap: 12 }}>
        <button onClick={onClose} style={{ background: 'rgba(255,255,255,0.15)', border: 'none', borderRadius: 10, padding: 8, cursor: 'pointer', color: 'white' }}>
          <X size={20} />
        </button>
        <div style={{ flex: 1 }}>
          <div style={{ fontSize: 17, fontWeight: 700, color: 'white' }}>AI Food Scanner</div>
          <div style={{ fontSize: 12, color: '#94a3b8' }}>{phase === 'scanning' ? 'Point camera at your food' : 'Tap a food to add it'}</div>
        </div>
      </div>

      {phase === 'scanning' ? (
        <div style={{ flex: 1, position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden' }}>
          <video
            ref={videoRef}
            autoPlay
            playsInline
            muted
            style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover', opacity: 0.7 }}
          />
          {/* Scanning overlay */}
          <div style={{ position: 'relative', zIndex: 10, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 20 }}>
            <div style={{
              width: 220, height: 220, border: '3px solid #f97316', borderRadius: 24,
              boxShadow: '0 0 0 4000px rgba(0,0,0,0.4), 0 0 30px rgba(249,115,22,0.6)',
              position: 'relative', overflow: 'hidden',
            }}>
              {/* Scanning line animation */}
              <div style={{
                position: 'absolute', left: 0, right: 0, height: 2,
                background: 'linear-gradient(90deg, transparent, #f97316, transparent)',
                animation: 'scanLine 1.5s ease-in-out infinite',
              }} />
            </div>
            <div style={{ color: 'white', fontSize: 14, fontWeight: 600, textAlign: 'center' }}>
              🧠 Analyzing food composition...
            </div>
          </div>
          <style>{`@keyframes scanLine { 0%{top:0} 50%{top:calc(100% - 2px)} 100%{top:0} }`}</style>
        </div>
      ) : (
        <div style={{ flex: 1, padding: '16px 20px', display: 'flex', flexDirection: 'column', gap: 12 }}>
          <div style={{
            background: 'rgba(249,115,22,0.15)', borderRadius: 14, padding: '12px 16px',
            border: '1px solid rgba(249,115,22,0.3)', display: 'flex', gap: 10, alignItems: 'center',
          }}>
            <span style={{ fontSize: 20 }}>✅</span>
            <div>
              <div style={{ color: 'white', fontWeight: 700, fontSize: 14 }}>Food detected!</div>
              <div style={{ color: '#94a3b8', fontSize: 12 }}>Tap an item to log it</div>
            </div>
          </div>
          {detected.map((food, i) => (
            <button
              key={i}
              onClick={() => pick(food)}
              style={{
                background: 'rgba(255,255,255,0.08)', border: '1px solid rgba(255,255,255,0.12)',
                borderRadius: 16, padding: '14px 16px', cursor: 'pointer', textAlign: 'left',
                display: 'flex', justifyContent: 'space-between', alignItems: 'center',
              }}
            >
              <div>
                <div style={{ fontSize: 15, fontWeight: 700, color: 'white' }}>{food.name}</div>
                <div style={{ fontSize: 12, color: '#94a3b8', marginTop: 2 }}>{food.portion}</div>
                <div style={{ display: 'flex', gap: 10, marginTop: 6, fontSize: 12 }}>
                  <span style={{ color: '#6366f1', fontWeight: 600 }}>P {food.p}g</span>
                  <span style={{ color: '#f59e0b', fontWeight: 600 }}>C {food.c}g</span>
                  <span style={{ color: '#10b981', fontWeight: 600 }}>F {food.f}g</span>
                </div>
              </div>
              <div style={{ textAlign: 'right' }}>
                <div style={{ fontSize: 18, fontWeight: 800, color: '#ef4444' }}>{food.cal}</div>
                <div style={{ fontSize: 11, color: '#94a3b8' }}>kcal</div>
                <div style={{ marginTop: 6, fontSize: 12, color: '#f97316', fontWeight: 600 }}>+ Add</div>
              </div>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

// ─── Barcode Scan Modal ────────────────────────────────────────────────────────
function BarcodeScanModal({ onAdd, onClose }: { onAdd: (food: FoodItem) => void; onClose: () => void }) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const [phase, setPhase] = useState<'scanning' | 'found' | 'notfound'>('scanning');
  const [result, setResult] = useState<FoodItem | null>(null);

  useEffect(() => {
    let timer: ReturnType<typeof setTimeout>;

    navigator.mediaDevices?.getUserMedia({ video: { facingMode: 'environment' } })
      .then(async (stream) => {
        streamRef.current = stream;
        if (videoRef.current) videoRef.current.srcObject = stream;

        // Try native BarcodeDetector API (Chrome/Edge)
        if ('BarcodeDetector' in window) {
          const detector = new (window as unknown as { BarcodeDetector: new(opts: object) => { detect: (src: HTMLVideoElement) => Promise<{ rawValue: string }[]> } }).BarcodeDetector({ formats: ['ean_13', 'ean_8', 'upc_a', 'upc_e', 'code_128'] });
          const detect = async () => {
            if (!videoRef.current) return;
            try {
              const codes = await detector.detect(videoRef.current);
              if (codes.length > 0) {
                clearTimeout(timer);
                streamRef.current?.getTracks().forEach(t => t.stop());
                const food = barcodeDb[Math.floor(Math.random() * barcodeDb.length)];
                setResult(food);
                setPhase('found');
                return;
              }
            } catch {}
            timer = setTimeout(detect, 300);
          };
          timer = setTimeout(detect, 500);
        } else {
          // Fallback: simulate after 3.5s
          timer = setTimeout(() => {
            const food = barcodeDb[Math.floor(Math.random() * barcodeDb.length)];
            setResult(food);
            setPhase('found');
          }, 3500);
        }
      }).catch(() => {
        // No camera — simulate
        timer = setTimeout(() => {
          const food = barcodeDb[Math.floor(Math.random() * barcodeDb.length)];
          setResult(food);
          setPhase('found');
        }, 2000);
      });

    return () => {
      clearTimeout(timer);
      streamRef.current?.getTracks().forEach(t => t.stop());
    };
  }, []);

  return (
    <div style={{
      position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.95)', zIndex: 2000,
      display: 'flex', flexDirection: 'column',
    }}>
      <div style={{ padding: '52px 20px 12px', display: 'flex', alignItems: 'center', gap: 12 }}>
        <button onClick={onClose} style={{ background: 'rgba(255,255,255,0.15)', border: 'none', borderRadius: 10, padding: 8, cursor: 'pointer', color: 'white' }}>
          <X size={20} />
        </button>
        <div>
          <div style={{ fontSize: 17, fontWeight: 700, color: 'white' }}>Barcode Scanner</div>
          <div style={{ fontSize: 12, color: '#94a3b8' }}>{phase === 'scanning' ? 'Align barcode in the frame' : 'Product found!'}</div>
        </div>
      </div>

      {phase === 'scanning' && (
        <div style={{ flex: 1, position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden' }}>
          <video
            ref={videoRef}
            autoPlay
            playsInline
            muted
            style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover', opacity: 0.6 }}
          />
          <div style={{ position: 'relative', zIndex: 10, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 16 }}>
            <div style={{
              width: 260, height: 140, border: '3px solid #3b82f6', borderRadius: 14,
              boxShadow: '0 0 0 4000px rgba(0,0,0,0.5), 0 0 30px rgba(59,130,246,0.5)',
              position: 'relative', overflow: 'hidden',
              display: 'flex', alignItems: 'center',
            }}>
              {/* Corner markers */}
              {[[-1,-1],[1,-1],[-1,1],[1,1]].map(([sx,sy], i) => (
                <div key={i} style={{
                  position: 'absolute',
                  top: sy === -1 ? 6 : 'auto', bottom: sy === 1 ? 6 : 'auto',
                  left: sx === -1 ? 6 : 'auto', right: sx === 1 ? 6 : 'auto',
                  width: 20, height: 20,
                  borderTop: sy === -1 ? '3px solid #3b82f6' : 'none',
                  borderBottom: sy === 1 ? '3px solid #3b82f6' : 'none',
                  borderLeft: sx === -1 ? '3px solid #3b82f6' : 'none',
                  borderRight: sx === 1 ? '3px solid #3b82f6' : 'none',
                }} />
              ))}
              <div style={{
                position: 'absolute', left: 0, right: 0, height: 2,
                background: 'linear-gradient(90deg, transparent, #3b82f6, transparent)',
                animation: 'scanLine 1.2s ease-in-out infinite',
              }} />
            </div>
            <div style={{ color: 'white', fontSize: 13, fontWeight: 600 }}>📷 Scanning for barcode...</div>
          </div>
          <style>{`@keyframes scanLine { 0%{top:0} 50%{top:calc(100% - 2px)} 100%{top:0} }`}</style>
        </div>
      )}

      {phase === 'found' && result && (
        <div style={{ flex: 1, padding: '20px', display: 'flex', flexDirection: 'column', gap: 16 }}>
          <div style={{ background: 'rgba(59,130,246,0.15)', borderRadius: 16, padding: '16px', border: '1px solid rgba(59,130,246,0.3)' }}>
            <div style={{ fontSize: 13, color: '#93c5fd', fontWeight: 600, marginBottom: 8 }}>✅ Barcode scanned successfully</div>
            <div style={{ fontSize: 18, fontWeight: 800, color: 'white', marginBottom: 4 }}>{result.name}</div>
            <div style={{ fontSize: 13, color: '#94a3b8' }}>{result.portion} per serving</div>
            <div style={{ display: 'flex', gap: 12, marginTop: 14 }}>
              {[
                { label: 'Calories', value: `${result.cal} kcal`, color: '#ef4444' },
                { label: 'Protein', value: `${result.p}g`, color: '#6366f1' },
                { label: 'Carbs', value: `${result.c}g`, color: '#f59e0b' },
                { label: 'Fat', value: `${result.f}g`, color: '#10b981' },
              ].map(m => (
                <div key={m.label} style={{ flex: 1, background: 'rgba(255,255,255,0.07)', borderRadius: 10, padding: '10px 4px', textAlign: 'center' }}>
                  <div style={{ fontSize: 15, fontWeight: 800, color: m.color }}>{m.value}</div>
                  <div style={{ fontSize: 10, color: '#64748b', marginTop: 2 }}>{m.label}</div>
                </div>
              ))}
            </div>
          </div>
          <div style={{ display: 'flex', gap: 10 }}>
            <button
              onClick={onClose}
              style={{
                flex: 1, padding: '14px', borderRadius: 14, border: '1px solid rgba(255,255,255,0.15)',
                background: 'transparent', color: '#94a3b8', fontWeight: 600, cursor: 'pointer', fontSize: 15,
              }}
            >
              Cancel
            </button>
            <button
              onClick={() => { onAdd(result); onClose(); }}
              style={{
                flex: 2, padding: '14px', borderRadius: 14, border: 'none',
                background: 'linear-gradient(135deg,#3b82f6,#1d4ed8)',
                color: 'white', fontWeight: 800, cursor: 'pointer', fontSize: 15,
              }}
            >
              Add to Log +
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

// ─── Add Food Modal ────────────────────────────────────────────────────────────
const MEAL_IDS = ['breakfast', 'lunch', 'snack', 'dinner'];
const MEAL_LABELS: Record<string, string> = { breakfast: '🍳 Breakfast', lunch: '🥗 Lunch', snack: '🍎 Snack', dinner: '🍽️ Dinner' };

function AddFoodModal({ defaultMealId, onAdd, onClose }: { defaultMealId: string; onAdd: (item: Omit<LoggedFoodItem, 'id' | 'timestamp'>) => void; onClose: () => void }) {
  const [tab, setTab] = useState<'manual' | 'ai' | 'barcode'>('manual');
  const [mealId, setMealId] = useState(defaultMealId);
  const [name, setName] = useState('');
  const [portion, setPortion] = useState('');
  const [cal, setCal] = useState('');
  const [p, setP] = useState('');
  const [c, setC] = useState('');
  const [f, setF] = useState('');
  const [search, setSearch] = useState('');

  const commonFoods: FoodItem[] = [
    { name: 'Banana', portion: '1 medium', cal: 105, p: 1, c: 27, f: 0 },
    { name: 'Chicken Breast', portion: '100g', cal: 165, p: 31, c: 0, f: 4 },
    { name: 'White Rice (cooked)', portion: '150g', cal: 195, p: 4, c: 43, f: 0 },
    { name: 'Egg', portion: '1 large', cal: 72, p: 6, c: 0, f: 5 },
    { name: 'Oats (dry)', portion: '40g', cal: 148, p: 5, c: 27, f: 3 },
    { name: 'Salmon', portion: '100g', cal: 208, p: 20, c: 0, f: 13 },
    { name: 'Broccoli', portion: '100g', cal: 34, p: 3, c: 7, f: 0 },
    { name: 'Greek Yogurt', portion: '170g', cal: 90, p: 15, c: 6, f: 0 },
    { name: 'Almonds', portion: '28g', cal: 164, p: 6, c: 6, f: 14 },
    { name: 'Sweet Potato', portion: '100g', cal: 86, p: 2, c: 20, f: 0 },
    { name: 'Avocado', portion: '½ fruit', cal: 120, p: 2, c: 6, f: 11 },
    { name: 'Protein Shake', portion: '1 scoop + 250ml milk', cal: 270, p: 30, c: 20, f: 6 },
  ];

  const filtered = commonFoods.filter(f =>
    f.name.toLowerCase().includes(search.toLowerCase())
  );

  const submitManual = () => {
    if (!name || !cal) return;
    onAdd({ mealId, name, portion: portion || '1 serving', cal: +cal, p: +(p || 0), c: +(c || 0), f: +(f || 0) });
    onClose();
  };

  const pickQuick = (food: FoodItem) => {
    onAdd({ mealId, ...food });
    onClose();
  };

  if (tab === 'ai') return <AIScanModal onAdd={food => onAdd({ mealId, ...food })} onClose={onClose} />;
  if (tab === 'barcode') return <BarcodeScanModal onAdd={food => onAdd({ mealId, ...food })} onClose={onClose} />;

  return (
    <div style={{
      position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', zIndex: 2000,
      display: 'flex', flexDirection: 'column', justifyContent: 'flex-end',
    }}>
      <div style={{
        background: 'white', borderRadius: '24px 24px 0 0',
        maxHeight: '88vh', overflowY: 'auto', paddingBottom: 32,
      }}>
        {/* Handle */}
        <div style={{ display: 'flex', justifyContent: 'center', padding: '12px 0 4px' }}>
          <div style={{ width: 40, height: 4, borderRadius: 2, background: '#e2e8f0' }} />
        </div>

        <div style={{ padding: '8px 20px 16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div style={{ fontSize: 18, fontWeight: 800, color: '#111827' }}>Add Food</div>
          <button onClick={onClose} style={{ background: '#f1f5f9', border: 'none', borderRadius: 10, padding: 8, cursor: 'pointer' }}>
            <X size={18} />
          </button>
        </div>

        {/* Meal selector */}
        <div style={{ padding: '0 20px 16px' }}>
          <div style={{ fontSize: 12, fontWeight: 700, color: '#94a3b8', marginBottom: 8, textTransform: 'uppercase', letterSpacing: '0.06em' }}>Add to meal</div>
          <div style={{ display: 'flex', gap: 8, overflowX: 'auto' }}>
            {MEAL_IDS.map(id => (
              <button
                key={id}
                onClick={() => setMealId(id)}
                style={{
                  padding: '8px 14px', borderRadius: 10, border: 'none', cursor: 'pointer', whiteSpace: 'nowrap',
                  background: mealId === id ? '#f97316' : '#f1f5f9',
                  color: mealId === id ? 'white' : '#64748b',
                  fontWeight: mealId === id ? 700 : 500, fontSize: 13,
                }}
              >
                {MEAL_LABELS[id]}
              </button>
            ))}
          </div>
        </div>

        {/* Tab switcher */}
        <div style={{ padding: '0 20px 16px', display: 'flex', gap: 8 }}>
          {([['manual', '✏️ Manual'], ['ai', '🧠 AI Scan'], ['barcode', '📦 Barcode']] as [typeof tab, string][]).map(([t, label]) => (
            <button
              key={t}
              onClick={() => setTab(t)}
              style={{
                flex: 1, padding: '10px 4px', borderRadius: 12, border: 'none', cursor: 'pointer', fontSize: 12, fontWeight: 700,
                background: tab === t ? '#111827' : '#f1f5f9',
                color: tab === t ? 'white' : '#64748b',
              }}
            >
              {label}
            </button>
          ))}
        </div>

        {/* Manual tab content */}
        <div style={{ padding: '0 20px' }}>
          {/* Quick search */}
          <div style={{ position: 'relative', marginBottom: 16 }}>
            <Search size={16} color="#94a3b8" style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)' }} />
            <input
              placeholder="Search common foods..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              style={{
                width: '100%', padding: '12px 12px 12px 38px', borderRadius: 12,
                border: '1.5px solid #e2e8f0', fontSize: 14, outline: 'none', background: '#f8fafc',
                boxSizing: 'border-box',
              }}
            />
          </div>

          {search && filtered.length > 0 && (
            <div style={{ marginBottom: 16, border: '1px solid #f1f5f9', borderRadius: 14, overflow: 'hidden' }}>
              {filtered.slice(0, 5).map((food, i) => (
                <button
                  key={i}
                  onClick={() => pickQuick(food)}
                  style={{
                    width: '100%', padding: '12px 14px', background: 'white', border: 'none',
                    borderBottom: i < filtered.length - 1 ? '1px solid #f8fafc' : 'none',
                    cursor: 'pointer', display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                    textAlign: 'left',
                  }}
                >
                  <div>
                    <div style={{ fontWeight: 600, fontSize: 14, color: '#111827' }}>{food.name}</div>
                    <div style={{ fontSize: 12, color: '#94a3b8' }}>{food.portion} · P {food.p}g C {food.c}g F {food.f}g</div>
                  </div>
                  <div style={{ fontSize: 14, fontWeight: 800, color: '#ef4444' }}>{food.cal} kcal</div>
                </button>
              ))}
            </div>
          )}

          {/* Manual form */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            <input
              placeholder="Food name *"
              value={name}
              onChange={e => setName(e.target.value)}
              style={{ padding: '12px', borderRadius: 12, border: '1.5px solid #e2e8f0', fontSize: 14, outline: 'none' }}
            />
            <div style={{ display: 'flex', gap: 10 }}>
              <input
                placeholder="Portion (e.g. 100g)"
                value={portion}
                onChange={e => setPortion(e.target.value)}
                style={{ flex: 1, padding: '12px', borderRadius: 12, border: '1.5px solid #e2e8f0', fontSize: 14, outline: 'none' }}
              />
              <input
                type="number"
                placeholder="Calories *"
                value={cal}
                onChange={e => setCal(e.target.value)}
                style={{ flex: 1, padding: '12px', borderRadius: 12, border: '1.5px solid #e2e8f0', fontSize: 14, outline: 'none' }}
              />
            </div>
            <div style={{ display: 'flex', gap: 10 }}>
              {[['Protein (g)', p, setP], ['Carbs (g)', c, setC], ['Fat (g)', f, setF]].map(([label, val, setter]) => (
                <div key={label as string} style={{ flex: 1 }}>
                  <div style={{ fontSize: 11, fontWeight: 600, color: '#94a3b8', marginBottom: 4 }}>{label as string}</div>
                  <input
                    type="number"
                    value={val as string}
                    onChange={e => (setter as (v: string) => void)(e.target.value)}
                    style={{ width: '100%', padding: '10px', borderRadius: 12, border: '1.5px solid #e2e8f0', fontSize: 14, outline: 'none', boxSizing: 'border-box' }}
                  />
                </div>
              ))}
            </div>

            <div style={{ display: 'flex', gap: 10, marginTop: 4 }}>
              <button
                onClick={() => setTab('ai')}
                style={{
                  flex: 1, padding: '13px', borderRadius: 12, border: '1.5px solid #f97316',
                  background: '#fff7ed', color: '#f97316', fontWeight: 700, cursor: 'pointer', fontSize: 13,
                  display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6,
                }}
              >
                <Camera size={16} /> AI Scan
              </button>
              <button
                onClick={() => setTab('barcode')}
                style={{
                  flex: 1, padding: '13px', borderRadius: 12, border: '1.5px solid #3b82f6',
                  background: '#eff6ff', color: '#3b82f6', fontWeight: 700, cursor: 'pointer', fontSize: 13,
                  display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6,
                }}
              >
                <Barcode size={16} /> Barcode
              </button>
            </div>

            <button
              onClick={submitManual}
              disabled={!name || !cal}
              style={{
                padding: '15px', borderRadius: 14, border: 'none',
                background: !name || !cal ? '#e2e8f0' : 'linear-gradient(135deg, #f97316, #ea580c)',
                color: !name || !cal ? '#94a3b8' : 'white',
                fontWeight: 800, fontSize: 16, cursor: !name || !cal ? 'not-allowed' : 'pointer',
              }}
            >
              Add Food
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── Main Diet Component ───────────────────────────────────────────────────────
export function Diet() {
  const { profile, foodLog, addFoodLog, removeFoodLog } = useStore();
  const [expandedMeal, setExpandedMeal] = useState<string | null>('breakfast');
  const [water, setWater] = useState(0);
  const [dietTab, setDietTab] = useState<'plan' | 'log'>('plan');
  const [addModal, setAddModal] = useState<{ open: boolean; mealId: string }>({ open: false, mealId: 'breakfast' });

  if (!profile) return null;

  const targetCal = calcTargetCalories(profile);
  const macros = calcMacros(targetCal, profile.goal);
  const meals = getMealPlanForGoal(profile.goal);

  const today = new Date().toISOString().split('T')[0];
  const todayLog = foodLog.filter(f => f.timestamp.startsWith(today));

  // Totals from plan
  const planCal = meals.reduce((acc, m) => acc + m.foods.reduce((a, f) => a + f.cal, 0), 0);
  const planP = meals.reduce((acc, m) => acc + m.foods.reduce((a, f) => a + f.p, 0), 0);
  const planC = meals.reduce((acc, m) => acc + m.foods.reduce((a, f) => a + f.c, 0), 0);
  const planF = meals.reduce((acc, m) => acc + m.foods.reduce((a, f) => a + f.f, 0), 0);

  // Totals from log
  const logCal = todayLog.reduce((a, f) => a + f.cal, 0);
  const logP = todayLog.reduce((a, f) => a + f.p, 0);
  const logC = todayLog.reduce((a, f) => a + f.c, 0);
  const logF = todayLog.reduce((a, f) => a + f.f, 0);

  const totalMealCal = dietTab === 'plan' ? planCal : logCal;
  const totalP = dietTab === 'plan' ? planP : logP;
  const totalC = dietTab === 'plan' ? planC : logC;
  const totalF = dietTab === 'plan' ? planF : logF;

  const calPct = Math.min(100, (totalMealCal / targetCal) * 100);

  const handleAddFood = (item: Omit<LoggedFoodItem, 'id' | 'timestamp'>) => {
    addFoodLog({
      ...item,
      id: `${Date.now()}-${Math.random()}`,
      timestamp: new Date().toISOString(),
    });
  };

  const cardStyle: React.CSSProperties = {
    background: 'white',
    borderRadius: 20,
    boxShadow: '0 1px 3px rgba(0,0,0,0.06)',
    border: '1px solid #f1f5f9',
    overflow: 'hidden',
  };

  return (
    <div style={{ paddingBottom: '6rem' }}>
      {/* Header */}
      <div style={{
        background: 'linear-gradient(135deg, #f97316 0%, #ea580c 100%)',
        padding: '56px 20px 24px',
        borderRadius: '0 0 28px 28px',
        color: 'white',
      }}>
        <div style={{ fontSize: 24, fontWeight: 800, marginBottom: 4 }}>Nutrition</div>
        <div style={{ fontSize: 14, opacity: 0.85 }}>Tailored to your goals · Smart eating</div>

        {/* Calorie arc */}
        <div style={{ marginTop: 16, background: 'rgba(255,255,255,0.15)', borderRadius: 18, padding: '18px', backdropFilter: 'blur(4px)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
            <div style={{ position: 'relative' }}>
              <svg width={90} height={90} viewBox="0 0 90 90" style={{ transform: 'rotate(-90deg)' }}>
                <circle cx={45} cy={45} r={36} fill="none" stroke="rgba(255,255,255,0.2)" strokeWidth={9} />
                <circle
                  cx={45} cy={45} r={36} fill="none" stroke="white" strokeWidth={9}
                  strokeDasharray={2 * Math.PI * 36}
                  strokeDashoffset={2 * Math.PI * 36 * (1 - calPct / 100)}
                  strokeLinecap="round"
                  style={{ transition: 'stroke-dashoffset 0.6s ease' }}
                />
              </svg>
              <div style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
                <div style={{ fontSize: 15, fontWeight: 800 }}>{Math.round(calPct)}%</div>
                <div style={{ fontSize: 9, opacity: 0.8 }}>today</div>
              </div>
            </div>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 13, opacity: 0.85, marginBottom: 2 }}>Daily Calories</div>
              <div style={{ fontSize: 28, fontWeight: 800 }}>{totalMealCal.toLocaleString()}</div>
              <div style={{ fontSize: 13, opacity: 0.75 }}>of {targetCal.toLocaleString()} kcal target</div>
              <div style={{ marginTop: 8, fontSize: 12, opacity: 0.85 }}>
                Remaining: <strong>{(targetCal - totalMealCal).toLocaleString()} kcal</strong>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div style={{ padding: '16px', display: 'flex', flexDirection: 'column', gap: 14 }}>
        {/* Macro rings */}
        <div style={{ ...cardStyle, padding: '20px' }}>
          <div style={{ fontSize: 15, fontWeight: 700, color: '#111827', marginBottom: 16 }}>Macros Today</div>
          <div style={{ display: 'flex', justifyContent: 'space-around' }}>
            <MacroRing value={totalP} max={macros.protein} color="#6366f1" label="Protein" />
            <MacroRing value={totalC} max={macros.carbs} color="#f59e0b" label="Carbs" />
            <MacroRing value={totalF} max={macros.fat} color="#10b981" label="Fat" />
          </div>
          <div style={{ marginTop: 16, background: '#f8fafc', borderRadius: 12, padding: '10px 12px', display: 'flex', gap: 12 }}>
            {[
              { label: 'Target Protein', value: macros.protein, unit: 'g', color: '#6366f1' },
              { label: 'Target Carbs', value: macros.carbs, unit: 'g', color: '#f59e0b' },
              { label: 'Target Fat', value: macros.fat, unit: 'g', color: '#10b981' },
            ].map(m => (
              <div key={m.label} style={{ flex: 1, textAlign: 'center' }}>
                <div style={{ fontSize: 16, fontWeight: 800, color: m.color }}>{m.value}{m.unit}</div>
                <div style={{ fontSize: 10, color: '#94a3b8' }}>{m.label}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Plan / My Log tab switch */}
        <div style={{ display: 'flex', background: '#f1f5f9', borderRadius: 14, padding: 4 }}>
          <button
            onClick={() => setDietTab('plan')}
            style={{
              flex: 1, padding: '10px', borderRadius: 11, border: 'none', cursor: 'pointer', fontSize: 14, fontWeight: 700,
              background: dietTab === 'plan' ? 'white' : 'transparent',
              color: dietTab === 'plan' ? '#f97316' : '#64748b',
              boxShadow: dietTab === 'plan' ? '0 1px 4px rgba(0,0,0,0.08)' : 'none',
              transition: 'all 0.2s',
            }}
          >
            📋 Meal Plan
          </button>
          <button
            onClick={() => setDietTab('log')}
            style={{
              flex: 1, padding: '10px', borderRadius: 11, border: 'none', cursor: 'pointer', fontSize: 14, fontWeight: 700,
              background: dietTab === 'log' ? 'white' : 'transparent',
              color: dietTab === 'log' ? '#f97316' : '#64748b',
              boxShadow: dietTab === 'log' ? '0 1px 4px rgba(0,0,0,0.08)' : 'none',
              transition: 'all 0.2s',
            }}
          >
            ✏️ My Log {todayLog.length > 0 && <span style={{ background: '#f97316', color: 'white', borderRadius: 8, padding: '1px 6px', fontSize: 11, marginLeft: 4 }}>{todayLog.length}</span>}
          </button>
        </div>

        {/* ──── PLAN TAB ──── */}
        {dietTab === 'plan' && (
          <>
            <div>
              <div style={{ fontSize: 16, fontWeight: 700, color: '#111827', marginBottom: 12 }}>Today's Meal Plan</div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                {meals.map(meal => {
                  const mealCal = meal.foods.reduce((a, f) => a + f.cal, 0);
                  const mealP = meal.foods.reduce((a, f) => a + f.p, 0);
                  const mealC = meal.foods.reduce((a, f) => a + f.c, 0);
                  const mealF = meal.foods.reduce((a, f) => a + f.f, 0);
                  const isOpen = expandedMeal === meal.id;

                  return (
                    <div key={meal.id} style={cardStyle}>
                      <div
                        style={{ padding: '16px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 12 }}
                        onClick={() => setExpandedMeal(isOpen ? null : meal.id)}
                      >
                        <div style={{
                          width: 46, height: 46, borderRadius: 13, background: '#fff7ed',
                          display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 24, flexShrink: 0,
                        }}>
                          {meal.icon}
                        </div>
                        <div style={{ flex: 1 }}>
                          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                            <div style={{ fontWeight: 700, fontSize: 15, color: '#111827' }}>{meal.name}</div>
                            <div style={{ fontSize: 14, fontWeight: 800, color: '#f97316' }}>{mealCal} kcal</div>
                          </div>
                          <div style={{ fontSize: 12, color: '#94a3b8', marginTop: 2 }}>{meal.time} · {meal.foods.length} foods</div>
                          <div style={{ display: 'flex', gap: 10, marginTop: 6, fontSize: 11 }}>
                            <span style={{ color: '#6366f1', fontWeight: 600 }}>P {mealP}g</span>
                            <span style={{ color: '#f59e0b', fontWeight: 600 }}>C {mealC}g</span>
                            <span style={{ color: '#10b981', fontWeight: 600 }}>F {mealF}g</span>
                          </div>
                        </div>
                        <div style={{ color: '#94a3b8', flexShrink: 0 }}>
                          {isOpen ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
                        </div>
                      </div>

                      {isOpen && (
                        <div style={{ padding: '0 16px 16px', borderTop: '1px solid #f8fafc' }}>
                          <div style={{ marginTop: 12 }}>
                            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 10, fontSize: 10, fontWeight: 700, color: '#94a3b8', marginBottom: 4, paddingRight: 2 }}>
                              <span style={{ minWidth: 32, textAlign: 'center' }}>PROT</span>
                              <span style={{ minWidth: 32, textAlign: 'center' }}>CARB</span>
                              <span style={{ minWidth: 32, textAlign: 'center' }}>FAT</span>
                              <span style={{ minWidth: 38, textAlign: 'center' }}>KCAL</span>
                            </div>
                            {meal.foods.map((f, i) => (
                              <FoodRow key={i} food={f} />
                            ))}
                          </div>
                          <div style={{
                            display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                            marginTop: 10, padding: '10px 12px', background: '#f8fafc', borderRadius: 10,
                          }}>
                            <span style={{ fontSize: 13, fontWeight: 700, color: '#374151' }}>Meal Total</span>
                            <div style={{ display: 'flex', gap: 10, fontSize: 12 }}>
                              <span style={{ fontWeight: 700, color: '#6366f1' }}>{mealP}g P</span>
                              <span style={{ fontWeight: 700, color: '#f59e0b' }}>{mealC}g C</span>
                              <span style={{ fontWeight: 700, color: '#10b981' }}>{mealF}g F</span>
                              <span style={{ fontWeight: 800, color: '#ef4444' }}>{mealCal} kcal</span>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          </>
        )}

        {/* ──── MY LOG TAB ──── */}
        {dietTab === 'log' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
            {MEAL_IDS.map(mealId => {
              const mealItems = todayLog.filter(f => f.mealId === mealId);
              const mealCal = mealItems.reduce((a, f) => a + f.cal, 0);
              const mealP = mealItems.reduce((a, f) => a + f.p, 0);
              const mealC = mealItems.reduce((a, f) => a + f.c, 0);
              const mealF = mealItems.reduce((a, f) => a + f.f, 0);
              const isOpen = expandedMeal === mealId;

              return (
                <div key={mealId} style={cardStyle}>
                  <div
                    style={{ padding: '14px 16px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 12 }}
                    onClick={() => setExpandedMeal(isOpen ? null : mealId)}
                  >
                    <div style={{
                      width: 42, height: 42, borderRadius: 12, background: '#fff7ed',
                      display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 22, flexShrink: 0,
                    }}>
                      {MEAL_LABELS[mealId].split(' ')[0]}
                    </div>
                    <div style={{ flex: 1 }}>
                      <div style={{ fontWeight: 700, fontSize: 15, color: '#111827' }}>{MEAL_LABELS[mealId].slice(3)}</div>
                      <div style={{ fontSize: 12, color: '#94a3b8', marginTop: 2 }}>
                        {mealItems.length > 0 ? `${mealItems.length} item${mealItems.length > 1 ? 's' : ''} · ` : 'Nothing logged yet · '}
                        <span style={{ fontWeight: 700, color: '#f97316' }}>{mealCal} kcal</span>
                      </div>
                    </div>
                    <button
                      onClick={(e) => { e.stopPropagation(); setAddModal({ open: true, mealId }); }}
                      style={{
                        width: 34, height: 34, borderRadius: 10, border: 'none',
                        background: '#fff7ed', color: '#f97316', cursor: 'pointer',
                        display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
                      }}
                    >
                      <Plus size={18} />
                    </button>
                    <div style={{ color: '#94a3b8', flexShrink: 0, marginLeft: 4 }}>
                      {isOpen ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                    </div>
                  </div>

                  {isOpen && (
                    <div style={{ padding: '0 16px 16px', borderTop: '1px solid #f8fafc' }}>
                      {mealItems.length > 0 ? (
                        <>
                          <div style={{ marginTop: 10 }}>
                            {mealItems.map(item => (
                              <FoodRow
                                key={item.id}
                                food={item}
                                onRemove={() => removeFoodLog(item.id)}
                              />
                            ))}
                          </div>
                          <div style={{
                            display: 'flex', justifyContent: 'space-between',
                            marginTop: 10, padding: '10px 12px', background: '#f8fafc', borderRadius: 10,
                          }}>
                            <span style={{ fontSize: 13, fontWeight: 700, color: '#374151' }}>Total</span>
                            <div style={{ display: 'flex', gap: 8, fontSize: 12 }}>
                              <span style={{ fontWeight: 700, color: '#6366f1' }}>{mealP}g P</span>
                              <span style={{ fontWeight: 700, color: '#f59e0b' }}>{mealC}g C</span>
                              <span style={{ fontWeight: 700, color: '#10b981' }}>{mealF}g F</span>
                              <span style={{ fontWeight: 800, color: '#ef4444' }}>{mealCal} kcal</span>
                            </div>
                          </div>
                        </>
                      ) : (
                        <div style={{ padding: '16px 0', textAlign: 'center' }}>
                          <div style={{ fontSize: 32, marginBottom: 8 }}>🍽️</div>
                          <div style={{ fontSize: 14, color: '#94a3b8', marginBottom: 12 }}>No foods logged yet</div>
                          <button
                            onClick={() => setAddModal({ open: true, mealId })}
                            style={{
                              padding: '10px 20px', borderRadius: 12, border: 'none',
                              background: '#f97316', color: 'white', fontWeight: 700, cursor: 'pointer', fontSize: 14,
                              display: 'inline-flex', alignItems: 'center', gap: 6,
                            }}
                          >
                            <Plus size={16} /> Add Food
                          </button>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              );
            })}

            {/* Quick add FAB-style bar */}
            <div style={{
              background: 'linear-gradient(135deg,#f97316,#ea580c)', borderRadius: 18, padding: '14px 18px',
              display: 'flex', gap: 12,
            }}>
              <button
                onClick={() => setAddModal({ open: true, mealId: 'breakfast' })}
                style={{
                  flex: 1, padding: '11px', borderRadius: 12, border: 'none',
                  background: 'rgba(255,255,255,0.2)', color: 'white', fontWeight: 700, cursor: 'pointer', fontSize: 13,
                  display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6,
                }}
              >
                <Plus size={16} /> Log Food
              </button>
              <button
                onClick={() => { setAddModal({ open: true, mealId: 'breakfast' }); }}
                style={{
                  width: 46, height: 46, borderRadius: 12, border: 'none',
                  background: 'rgba(255,255,255,0.2)', color: 'white', cursor: 'pointer',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                }}
              >
                <Camera size={20} />
              </button>
              <button
                onClick={() => { setAddModal({ open: true, mealId: 'breakfast' }); }}
                style={{
                  width: 46, height: 46, borderRadius: 12, border: 'none',
                  background: 'rgba(255,255,255,0.2)', color: 'white', cursor: 'pointer',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                }}
              >
                <Barcode size={20} />
              </button>
            </div>

            {todayLog.length === 0 && (
              <div style={{ background: '#fafafa', borderRadius: 16, padding: '20px', textAlign: 'center', border: '1px dashed #e2e8f0' }}>
                <div style={{ fontSize: 11, fontWeight: 700, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
                  💡 Tip
                </div>
                <div style={{ fontSize: 13, color: '#64748b', marginTop: 6, lineHeight: 1.5 }}>
                  Use AI Scan to photograph your meal or scan a barcode to instantly log food with nutritional info.
                </div>
              </div>
            )}
          </div>
        )}

        {/* Water tracker */}
        <div style={{ ...cardStyle, padding: '18px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 14 }}>
            <Droplets size={20} color="#3b82f6" />
            <div style={{ fontSize: 15, fontWeight: 700, color: '#111827' }}>Water Intake</div>
            <div style={{ marginLeft: 'auto', fontSize: 16, fontWeight: 800, color: '#3b82f6' }}>{water}/8 glasses</div>
          </div>
          <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
            {Array.from({ length: 8 }).map((_, i) => (
              <button
                key={i}
                onClick={() => setWater(i < water ? i : i + 1)}
                style={{
                  width: 42, height: 52, borderRadius: 12, border: 'none', cursor: 'pointer',
                  background: i < water ? '#3b82f6' : '#f1f5f9',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: 20, transition: 'all 0.15s',
                  transform: i < water ? 'scale(1.05)' : 'scale(1)',
                }}
              >
                {i < water ? '💧' : '🫙'}
              </button>
            ))}
          </div>
          <div style={{ marginTop: 12, fontSize: 12, color: '#94a3b8' }}>
            {water >= 8 ? '🎉 Hydration goal reached!' : `${(8 - water) * 250}ml more to reach your goal`}
          </div>
        </div>

        {/* Daily totals */}
        <div style={{ background: '#fafafa', borderRadius: 20, padding: '16px', border: '1px solid #f1f5f9' }}>
          <div style={{ fontSize: 14, fontWeight: 700, color: '#374151', marginBottom: 12 }}>Daily Totals</div>
          {[
            { label: 'Calories', consumed: totalMealCal, target: targetCal, unit: 'kcal', color: '#ef4444' },
            { label: 'Protein', consumed: totalP, target: macros.protein, unit: 'g', color: '#6366f1' },
            { label: 'Carbs', consumed: totalC, target: macros.carbs, unit: 'g', color: '#f59e0b' },
            { label: 'Fat', consumed: totalF, target: macros.fat, unit: 'g', color: '#10b981' },
          ].map(item => {
            const pct = Math.min(100, (item.consumed / item.target) * 100);
            return (
              <div key={item.label} style={{ marginBottom: 10 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 13, marginBottom: 4 }}>
                  <span style={{ fontWeight: 600, color: '#374151' }}>{item.label}</span>
                  <span style={{ color: '#94a3b8' }}>{item.consumed}/{item.target} {item.unit}</span>
                </div>
                <div style={{ height: 7, background: '#e2e8f0', borderRadius: 4, overflow: 'hidden' }}>
                  <div style={{ width: `${pct}%`, height: '100%', background: item.color, borderRadius: 4, transition: 'width 0.5s ease' }} />
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Add Food Modal */}
      {addModal.open && (
        <AddFoodModal
          defaultMealId={addModal.mealId}
          onAdd={handleAddFood}
          onClose={() => setAddModal({ open: false, mealId: 'breakfast' })}
        />
      )}
    </div>
  );
}
