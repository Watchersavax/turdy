import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import toast from 'react-hot-toast';

const toastStyle = {
  style: {
    border: '3px solid #000',
    borderRadius: '0px',
    background: '#fff',
    color: '#000',
    fontWeight: 'bold',
    fontFamily: 'monospace',
  },
};

const steps = [
  { 
    id: 'follow', 
    label: 'Follow @TurdyETH', 
    url: 'https://x.com/intent/follow?screen_name=TurdyETH', 
    placeholder: 'Enter your @X_Username',
    pattern: /^@?(\w){1,15}$/,
    error: "Enter a valid X username (e.g., @TurdyNFT)"
  },
  { 
    id: 'like_rt', 
    label: 'Like & RT Post', 
    url: 'https://x.com/TurdyETH/status/2048811916790026482', 
    placeholder: 'Paste Like/RT Link',
    pattern: /^(https?:\/\/)?(www\.)?(twitter\.com|x\.com)\/.+/,
    error: "Paste a valid X/Twitter link"
  },
  { 
    id: 'comment', 
    label: 'Tag 2 friends and Comment EVM', 
    url: 'https://x.com/TurdyETH/status/2048811916790026482', 
    placeholder: 'Paste Comment Link',
    pattern: /^(https?:\/\/)?(www\.)?(twitter\.com|x\.com)\/.+/,
    error: "Paste a valid X/Twitter link"
  },
  { 
    id: 'quote', 
    label: 'Quote this Post', 
    url: 'https://x.com/TurdyETH/status/2048811916790026482', 
    placeholder: 'Paste Quote Link',
    pattern: /^(https?:\/\/)?(www\.)?(twitter\.com|x\.com)\/.+/,
    error: "Paste a valid X/Twitter link"
  },
  { 
    id: 'wallet', 
    label: 'Submit EVM Wallet', 
    placeholder: 'Enter EVM Wallet (0x...)',
    pattern: /^0x[a-fA-F0-9]{40}$/,
    error: "Invalid EVM wallet address"
  }
];

export default function WhitelistForm() {
  const [currentStep, setCurrentStep] = useState(0);
  const [verifying, setVerifying] = useState(false);
  const [taskUnlocked, setTaskUnlocked] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [inputValue, setInputValue] = useState('');
  const [formData, setFormData] = useState({
    username: '', likeRtLink: '', commentLink: '', quoteLink: '', wallet: '', referrer: ''
  });

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const ref = params.get('ref');
    if (ref) {
      setFormData(prev => ({ ...prev, referrer: ref }));
      toast.success(`Referral from ${ref} detected`, toastStyle);
    }
  }, []);

  const handleExternalTask = (url: string) => {
    window.open(url, '_blank');
    setVerifying(true);
    // 3s delay before unlocking the input field
    setTimeout(() => {
      setVerifying(false);
      setTaskUnlocked(true);
      toast.success('Task Active. Please provide the link below.', toastStyle);
    }, 3000);
  };

  const handleNextStep = () => {
    const currentTask = steps[currentStep];

    if (!taskUnlocked && currentStep < 4) {
      return toast.error("Complete the task above first!", toastStyle);
    }

    if (!inputValue) {
      return toast.error("Field cannot be empty.", toastStyle);
    }

    // Pattern Validation
    if (!currentTask.pattern.test(inputValue)) {
      return toast.error(currentTask.error, toastStyle);
    }

    const dataKeys = ['username', 'likeRtLink', 'commentLink', 'quoteLink', 'wallet'];
    setFormData(prev => ({ ...prev, [dataKeys[currentStep]]: inputValue }));

    if (currentStep < 4) {
      setInputValue('');
      setTaskUnlocked(false); // Relock for next step
      setCurrentStep(prev => prev + 1);
      toast.success('Response Recorded', { ...toastStyle, icon: '' });
    } else {
      submitToDatabase();
    }
  };

  const submitToDatabase = async () => {
    setVerifying(true);
    try {
      const res = await fetch('/.netlify/functions/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });
      if (res.ok) {
        setIsSubmitted(true);
        toast.success("Application Submitted.", toastStyle);
      } else {
        throw new Error();
      }
    } catch (err) {
      toast.error("Database error.", toastStyle);
    } finally {
      setVerifying(false);
    }
  };

  if (isSubmitted) {
    return (
      <div className="max-w-md mx-auto p-8 bg-white border-4 border-black shadow-[8px_8px_0px_rgba(0,0,0,1)] text-center">
        <h2 className="text-3xl font-black uppercase mb-4 italic text-black">You're in the queue</h2>
        <p className="mb-6 opacity-70 text-black">Share your link to increase your whitelist chances.</p>
        <button 
          onClick={() => {
            navigator.clipboard.writeText(`${window.location.origin}?ref=${formData.username}`);
            toast.success("Link Copied!", toastStyle);
          }}
          className="w-full py-4 cursor-pointer bg-brand-blue text-white font-bold uppercase border-2 border-black hover:bg-blue-600 transition-colors"
        >
          Copy My Referral Link
        </button>
      </div>
    );
  }

  // Wallet step (index 4) is auto-unlocked because there is no X task for it
  const isInputLocked = currentStep < 4 && !taskUnlocked;

  return (
    <div className="max-w-md mx-auto p-8 bg-white border-4 border-black shadow-[8px_8px_0px_rgba(0,0,0,1)] mt-10">
      {/* Progress Slabs */}
      <div className="flex justify-between mb-8">
        {steps.map((_, i) => (
          <div 
            key={i} 
            className={`h-2 flex-1 mx-1 border border-black ${i <= currentStep ? 'bg-black' : 'bg-zinc-100'}`}
          />
        ))}
      </div>

      <AnimatePresence mode="wait">
        {verifying ? (
          <motion.div key="loader" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="text-center py-10">
            <div className="animate-spin inline-block w-8 h-8 border-4 border-black border-t-transparent mb-4" />
            <p className="font-bold uppercase tracking-widest text-sm text-black">Verifying Task...</p>
          </motion.div>
        ) : (
          <motion.div key={currentStep} initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }}>
            <span className="text-[10px] font-bold uppercase opacity-50 tracking-[0.2em] text-black">Step {currentStep + 1} of 5</span>
            <h2 className="text-3xl font-black mb-6 uppercase tracking-tighter italic leading-none text-black">
              {steps[currentStep].label}
            </h2>

            <div className="space-y-6">
              {steps[currentStep].url && (
                <button
                  onClick={() => handleExternalTask(steps[currentStep].url!)}
                  className="w-full cursor-pointer py-3 bg-zinc-100 border-2 border-black font-bold uppercase text-sm hover:bg-zinc-200 transition-all text-black"
                >
                  Execute Task ↗
                </button>
              )}

              <div className={`space-y-4 transition-all duration-300 ${isInputLocked ? 'blur-[4px] pointer-events-none opacity-50' : 'blur-0'}`}>
                <input
                  type="text"
                  value={inputValue}
                  placeholder={steps[currentStep].placeholder}
                  className="w-full p-4 border-4 border-black outline-none focus:bg-zinc-50 font-bold placeholder:opacity-30 text-black"
                  onChange={(e) => setInputValue(e.target.value)}
                  disabled={isInputLocked}
                  onKeyDown={(e) => e.key === 'Enter' && handleNextStep()}
                />

                <button
                  onClick={handleNextStep}
                  disabled={isInputLocked}
                  className="w-full cursor-pointer py-4 bg-brand-blue text-white font-bold uppercase border-2 border-black shadow-[4px_4px_0px_rgba(0,0,0,1)] active:shadow-none active:translate-x-1 active:translate-y-1 transition-all"
                >
                  {currentStep === 4 ? 'Submit Application' : 'Next Task'}
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}