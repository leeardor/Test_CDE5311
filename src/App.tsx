import { useRef, useState, type ChangeEvent, type ReactNode } from 'react';
import { Check, ChevronRight, Heart, ImagePlus, Sparkles } from 'lucide-react';

type Screen = 'add' | 'details' | 'story' | 'review' | 'packaging' | 'ownDesign' | 'aiDesign' | 'listing' | 'saved';

const screens: Screen[] = ['add', 'details', 'story', 'review', 'packaging', 'ownDesign', 'aiDesign', 'listing', 'saved'];
const stories = {
  original: 'Ten years ago, we planted our first heirloom tomatoes in our backyard. Today, we grow them for our neighbours.',
  enhanced: 'What began with a few heirloom tomato plants in our backyard has grown into a farm that brings fresh, flavourful produce to our neighbours.',
};

function StatusBar() {
  return <div className="status-bar"><span className="status-time">9:41</span><span className="dynamic-island" /><img className="status-glyph" src="/assets/status-icons.svg" alt="" /></div>;
}

function Header({ title, back }: { title: string; back: () => void }) {
  return <header className="app-bar"><button className="back-button" type="button" aria-label="Go back" onClick={back}><img src="/assets/back-arrow.svg" alt="" /></button><h1>{title}</h1></header>;
}

function Progress({ title, step, total = 8 }: { title: string; step: number; total?: number }) {
  return <section className="step-section"><p className="step-label">{title} · Step {step} of {total}</p><div className="progress-track" aria-label={`Progress: step ${step} of ${total}`}><span style={{ width: `${(step / total) * 100}%` }} /></div></section>;
}

function Footer({ children }: { children: ReactNode }) { return <footer className="footer footer-stack">{children}</footer>; }

function Button({ children, onClick, secondary = false, disabled = false }: { children: ReactNode; onClick: () => void; secondary?: boolean; disabled?: boolean }) {
  return <button type="button" className={`action-button${secondary ? ' secondary' : ''}`} onClick={onClick} disabled={disabled}>{children}</button>;
}

export default function App() {
  const [screen, setScreen] = useState<Screen>('add');
  const [photoUrl, setPhotoUrl] = useState<string | null>(null);
  const [packagingUrl, setPackagingUrl] = useState<string | null>(null);
  const [notice, setNotice] = useState('');
  const [story, setStory] = useState(stories.original);
  const [storyEnhanced, setStoryEnhanced] = useState(false);
  const [ingredientsChecked, setIngredientsChecked] = useState(false);
  const [layout, setLayout] = useState('Product First');
  const [packageStyle, setPackageStyle] = useState('Natural');
  const [packageLayout, setPackageLayout] = useState('Label on front');
  const [packagingChoice, setPackagingChoice] = useState<'existing' | 'new'>('new');
  const productPicker = useRef<HTMLInputElement>(null);
  const packagePicker = useRef<HTMLInputElement>(null);

  const pickImage = (event: ChangeEvent<HTMLInputElement>, kind: 'product' | 'packaging') => {
    const file = event.currentTarget.files?.[0];
    if (!file) return;
    if (!file.type.startsWith('image/')) { setNotice('Please choose an image file.'); return; }
    const next = URL.createObjectURL(file);
    if (kind === 'product') {
      setPhotoUrl((current) => { if (current) URL.revokeObjectURL(current); return next; });
    } else {
      setPackagingUrl((current) => { if (current) URL.revokeObjectURL(current); return next; });
    }
    setNotice('');
  };

  const openPicker = (kind: 'product' | 'packaging', useCamera = false) => {
    const input = kind === 'product' ? productPicker.current : packagePicker.current;
    if (!input) return;
    if (useCamera) input.setAttribute('capture', 'environment'); else input.removeAttribute('capture');
    input.click();
  };

  const go = (next: Screen) => { setNotice(''); setScreen(next); };
  const back = () => {
    const idx = screens.indexOf(screen);
    if (screen === 'saved') { go('listing'); return; }
    if (screen === 'aiDesign' || screen === 'ownDesign') { go('packaging'); return; }
    if (idx > 0) go(screens[idx - 1]);
  };

  const title: Record<Screen, string> = {
    add: 'Add Product', details: 'Product Details', story: 'Tell Us More', review: 'Review Your Product',
    packaging: 'Product Packaging', ownDesign: 'Your Packaging', aiDesign: 'Your Packaging', listing: 'Product Page', saved: 'Saved',
  };

  const renderScreen = () => {
    switch (screen) {
      case 'add': return <>
        <Progress title="Add Product" step={1} />
        <div className="content-area">
          <button className={`photo-dropzone${photoUrl ? ' has-photo' : ''}`} type="button" onClick={() => openPicker('product')} aria-label={photoUrl ? 'Change product photo' : 'Choose product photo'}>
            {photoUrl ? <><img className="photo-preview" src={photoUrl} alt="Selected product" /><span className="photo-overlay">Tap to change photo</span></> : <><span className="camera-badge"><img src="/assets/camera.svg" alt="" /></span><span className="dropzone-prompt">Take a clear photo of your product and its packaging</span></>}
          </button>
          <input ref={productPicker} className="visually-hidden" type="file" accept="image/*" capture="environment" onChange={(e) => pickImage(e, 'product')} aria-label="Choose a product photo" />
          <div className="photo-actions"><button className="outline-button" type="button" onClick={() => openPicker('product', true)}>Take a photo</button><button className="outline-button" type="button" onClick={() => openPicker('product')}>Upload a photo</button></div>
          <aside className="ai-card"><strong>✦ Farmily AI</strong><p>We’ll read your photo and fill in the details.</p></aside>
        </div>
        <Footer><Button onClick={() => go('details')} disabled={!photoUrl}>Continue</Button></Footer>
      </>;

      case 'details': return <>
        <Progress title="Product Details" step={2} />
        <div className="content-area details-content">
          <div className="product-identity"><img src={photoUrl || '/assets/product.png'} alt="Product" /><div><strong>Green Valley Farm</strong><span>Check and edit your product information.</span></div></div>
          <div className="fields-grid">
            <label className="field"><span>Category</span><input defaultValue="Dairy" /></label>
            <label className="field"><span>Product name</span><input defaultValue="Fresh Goat Milk" /></label>
            <label className="field"><span>Ingredients</span><input defaultValue="Goat Milk" /></label>
            <label className="field"><span>Allergens</span><input defaultValue="Caseins, Whey Proteins" /></label>
            <label className="field"><span>Quantity</span><input defaultValue="500ml" /></label>
            <label className="field"><span>Price</span><input defaultValue="$8.00" /></label>
          </div>
          <button className={`check-row${ingredientsChecked ? ' checked' : ''}`} type="button" onClick={() => setIngredientsChecked(!ingredientsChecked)} aria-pressed={ingredientsChecked}><span className="check-box">{ingredientsChecked && <Check size={15} />}</span><span><strong>I’ve checked ingredients and allergens</strong><small>A photo can’t confirm ingredients or allergens. Please check these before continuing.</small></span></button>
        </div>
        <Footer><Button onClick={() => go('story')} disabled={!ingredientsChecked}>Continue</Button><Button secondary onClick={() => go('add')}>Back</Button></Footer>
      </>;

      case 'story': return <>
        <Progress title="Tell Us More" step={3} />
        <div className="content-area story-content">
          <p className="optional-label">Optional</p>
          <section className="content-card story-card">
            <h2>Your story</h2>
            <textarea value={story} onChange={(e) => setStory(e.target.value)} aria-label="Your product story" />
            <div className="story-ai-row"><span>{storyEnhanced ? '✦ AI-enhanced' : 'Your story'}</span><button className="text-button" type="button" onClick={() => { setStory(storyEnhanced ? stories.original : stories.enhanced); setStoryEnhanced(!storyEnhanced); }}>{storyEnhanced ? 'Original' : 'Polish with AI'}</button></div>
            {storyEnhanced && <div className="story-controls"><button type="button" onClick={() => setStory(stories.original)}>Original</button><button type="button" className="selected" onClick={() => setStory(stories.enhanced)}>Enhanced</button><button type="button" onClick={() => setStory(stories.enhanced)}>More casual</button><button type="button" onClick={() => setStory(stories.enhanced)}>Simplify</button></div>}
            <button className="outline-button story-prompt" type="button" onClick={() => { setStoryEnhanced(true); setStory(stories.enhanced); }}>✦ How can Farmily AI help you?</button>
          </section>
          <section className="content-card photo-section"><h2>Photos</h2>
            <div className="photo-category"><strong>Personal / Team Photo</strong><span>You or your team at the farm</span><img src="/assets/farm-team.png" alt="A farmer couple at their farm" /><button className="outline-button" type="button" onClick={() => openPicker('product')}>Add/Replace Photo</button></div>
            <div className="photo-category"><strong>Production / Process Photos</strong><span>Show how your product is made</span><div className="process-grid"><figure><img src="/assets/picking-tomatoes.png" alt="Hands picking tomatoes" /><figcaption>Picking tomatoes</figcaption></figure><figure><img src="/assets/packing-tomatoes.png" alt="Hands packing tomatoes" /><figcaption>Packing tomatoes</figcaption></figure></div><button className="outline-button" type="button" onClick={() => openPicker('product')}>Add/Replace Photo</button></div>
          </section>
        </div>
        <Footer><Button onClick={() => go('review')}>Continue</Button><Button secondary onClick={() => go('review')}>Skip</Button></Footer>
      </>;

      case 'review': return <>
        <Progress title="Review Your Product" step={5} />
        <div className="content-area review-content">
          <p className="intro-copy">Check everything before continuing. You can still make changes.</p>
          <section className="content-card review-card"><div className="section-title-row"><h2>Product Information</h2><button className="text-button" type="button" onClick={() => go('details')}>Edit</button></div><img className="review-hero" src="/assets/product.png" alt="Heirloom tomatoes" /><h3>Heirloom Tomatoes</h3><p className="muted">Green Valley Farm</p><Detail label="Price" value="$4.50 / 1 lb" /><Detail label="Allergens" value="None declared" /><Detail label="Ingredients" value="Heirloom tomatoes" /><div className="verified"><Check size={15} /> Ingredients and allergens checked by you.</div><div className="section-title-row"><h2>Additional Details</h2><span className="muted">Optional</span></div><div className="review-story"><strong>Your story</strong><p>{storyEnhanced ? stories.enhanced : story}</p></div><div className="review-images"><img src="/assets/farm-team.png" alt="Farm team" /><div><img src="/assets/picking-tomatoes.png" alt="Picking tomatoes" /><img src="/assets/packing-tomatoes.png" alt="Packing tomatoes" /></div></div></section>
          <p className="fine-print">By confirming, you approve this information for your packaging and listing.</p>
        </div>
        <Footer><Button onClick={() => go('packaging')}>Confirm &amp; Continue</Button><Button secondary onClick={() => go('story')}>Back</Button></Footer>
      </>;

      case 'packaging': return <>
        <Progress title="Product Packaging" step={6} />
        <div className="content-area packaging-content">
          <h2 className="page-question">Do you already have a packaging design?</h2>
          <button className={`option-card${packagingChoice === 'existing' ? ' selected-option' : ''}`} type="button" aria-pressed={packagingChoice === 'existing'} onClick={() => { setPackagingChoice('existing'); go('ownDesign'); }}><div className="option-top"><ImagePlus size={24} /><span className={`radio${packagingChoice === 'existing' ? ' selected-radio' : ''}`}>{packagingChoice === 'existing' && <Check size={13} />}</span></div><h3>I already have a design</h3><p>Upload your existing design and improve it while keeping its original identity.</p><span className="ai-path">✦ AI Refine</span><span className="option-action">Upload existing design <ChevronRight size={16} /></span></button>
          <button className={`option-card${packagingChoice === 'new' ? ' selected-option' : ''}`} type="button" aria-pressed={packagingChoice === 'new'} onClick={() => setPackagingChoice('new')}><div className="option-top"><Sparkles size={24} /><span className={`radio${packagingChoice === 'new' ? ' selected-radio' : ''}`}>{packagingChoice === 'new' && <Check size={13} />}</span></div><h3>Create a new design</h3><p>Create packaging based on your product information and story.</p><span className="ai-path">✦ AI Generate</span>{packagingChoice === 'new' && <p className="selected-note">✓ Selected · Uses the information you confirmed.</p>}</button>
          <div className="confirmed-product"><img src="/assets/product.png" alt="Heirloom tomatoes" /><div><strong>Heirloom Tomatoes</strong><span>Green Valley Farm · $4.50 / 1 lb</span></div></div>
        </div>
        <Footer><Button onClick={() => go(packagingChoice === 'existing' ? 'ownDesign' : 'aiDesign')}>{packagingChoice === 'existing' ? 'Upload existing design' : 'Generate Design'}</Button><Button secondary onClick={() => go('listing')}>Skip packaging</Button></Footer>
      </>;

      case 'ownDesign': return <>
        <Progress title="Your Packaging" step={5} />
        <div className="content-area own-content"><div className="ai-callout"><strong>✦ AI-assisted</strong><span>We only polish the photo. Your packaging design stays as it is.</span></div><div className="package-visual own-visual"><img src={packagingUrl || '/assets/packaging-photo.png'} alt="Your packaging design" /><div className="paper-label"><strong>Green Valley Farm</strong><span>Heirloom Tomatoes</span><b>1 lb · $4.50</b></div></div><div className="segmented"><button className={!storyEnhanced ? 'selected' : ''} type="button" onClick={() => setStoryEnhanced(false)}>Original</button><button className={storyEnhanced ? 'selected' : ''} type="button" onClick={() => setStoryEnhanced(true)}>Enhanced</button></div><div className="chip-row">{['Improve lighting', 'Clean background', 'Improve clarity'].map((x) => <button className="chip" key={x} type="button" onClick={() => setStoryEnhanced(true)}>{x}</button>)}</div><button className="outline-button" type="button" onClick={() => openPicker('packaging')}>Upload / replace design</button><input ref={packagePicker} className="visually-hidden" type="file" accept="image/*" onChange={(e) => pickImage(e, 'packaging')} aria-label="Upload packaging design" /><button className="text-button regenerate" type="button" onClick={() => setStoryEnhanced(!storyEnhanced)}>✦ Try again</button></div>
        <Footer><Button onClick={() => go('review')}>{storyEnhanced ? 'Use enhanced' : 'Keep original'}</Button><Button secondary onClick={() => go('packaging')}>Back</Button></Footer>
      </>;

      case 'aiDesign': return <>
        <Progress title="Your Packaging" step={7} />
        <div className="content-area generated-content"><div className="ai-callout"><strong>✦ AI-generated</strong><span>Created from your product information and story.</span></div><div className="package-visual generated-visual"><img src="/assets/packaging-design.png" alt="AI-generated produce box design" /><div className="paper-label"><strong>Green Valley Farm</strong><span>Heirloom Tomatoes</span><b>1 lb · $4.50</b></div></div><p className="visual-caption">Paper produce box · 1 lb · Label applied to front</p><div className="design-control"><span>Style</span><div className="segmented"><button className={packageStyle === 'Minimal' ? 'selected' : ''} type="button" onClick={() => setPackageStyle('Minimal')}>Minimal</button><button className={packageStyle === 'Natural' ? 'selected' : ''} type="button" onClick={() => setPackageStyle('Natural')}>Natural</button></div></div><div className="design-control"><span>Layout</span><div className="segmented"><button className={packageLayout === 'Label on front' ? 'selected' : ''} type="button" onClick={() => setPackageLayout('Label on front')}>Label on front</button><button className={packageLayout === 'Top label' ? 'selected' : ''} type="button" onClick={() => setPackageLayout('Top label')}>Top label</button></div></div><button className="text-button regenerate" type="button" onClick={() => setPackageStyle(packageStyle === 'Natural' ? 'Minimal' : 'Natural')}>✦ Regenerate</button><section className="content-card label-info"><span>Label information</span><Detail label="Quantity" value="1 lb" /><Detail label="Price" value="$4.50" /><p>Freshly picked. Great for salads.</p></section></div>
        <Footer><Button onClick={() => go('listing')}>Use This Design</Button><Button secondary onClick={() => go('listing')}>Skip packaging / Don’t use this design</Button></Footer>
      </>;

      case 'listing': return <>
        <Progress title="Product Page" step={8} />
        <div className="content-area listing-content"><div className="ai-callout recommendation"><strong>✦ AI recommendation</strong><span>Based on your content, we recommend this structure.</span></div><p className="small-prompt">Choose what customers see first.</p><div className="layout-options">{['Product First', 'Story First', 'Process First'].map((x) => <button className={layout === x ? 'active' : ''} type="button" key={x} onClick={() => setLayout(x)}>{x}</button>)}</div><p className="selection-note">✓ {layout} selected · Recommended</p><div className="preview-header"><strong>Customer Preview</strong><span>Not published</span></div><article className="content-card marketplace-card"><div className="marketplace-top"><span>Farmily</span><Heart size={19} /></div><img className="marketplace-hero" src="/assets/listing-product.png" alt="Colorful heirloom tomatoes" /><h2>Heirloom Tomatoes</h2><p>Green Valley Farm</p><strong className="market-price">$4.50 / 1 lb</strong><p>Freshly picked. Great for salads.</p><hr /><h3>Product Information</h3><Detail label="Farm" value="Green Valley Farm" /><Detail label="Ingredients" value="Heirloom tomatoes" /><Detail label="Allergens" value="None declared" /><hr /><h3>Packaging</h3><img className="packaging-preview" src="/assets/listing-box.png" alt="Produce box with product label" /><p>The story behind your tomatoes</p><p>{storyEnhanced ? stories.enhanced : story}</p><img className="farm-preview" src="/assets/listing-story.png" alt="Farm story" /><div className="review-images"><img src="/assets/picking-tomatoes.png" alt="Picking tomatoes" /><img src="/assets/packing-tomatoes.png" alt="Packing tomatoes" /></div><h3>Meet your farmer</h3><div className="farmer-row"><img src="/assets/farm-team.png" alt="Green Valley Farm team" /><div><strong>Green Valley Farm</strong><p>Grown with care, close to home.</p></div></div></article></div>
        <Footer><Button onClick={() => go('saved')}>Publish</Button><Button secondary onClick={() => go('aiDesign')}>Back</Button></Footer>
      </>;

      case 'saved': return <>
        <Progress title="Saved" step={8} />
        <div className="content-area saved-content"><div className="saved-icon"><Check size={27} /></div><h2>Saved to your catalogue</h2><article className="content-card saved-card"><img src="/assets/saved-product.png" alt="Heirloom tomatoes" /><div><strong>Heirloom Tomatoes</strong><span>Green Valley Farm</span><span>$4.50 / 1 lb</span></div><b className="draft-badge">Draft</b></article><p>Only you can see this until you publish.</p></div>
        <Footer><Button onClick={() => go('listing')}>Continue</Button><Button secondary onClick={() => go('add')}>Finish later</Button></Footer>
      </>;
    }
  };

  return <main className="prototype-stage"><section className="phone" aria-label="Farmily product onboarding"><StatusBar /><Header title={title[screen]} back={back} /><div className="main-content">{renderScreen()}{notice && <p className="notice" role="status">{notice}</p>}</div></section></main>;
}

function Detail({ label, value }: { label: string; value: string }) { return <div className="detail-row"><span>{label}</span><strong>{value}</strong></div>; }
