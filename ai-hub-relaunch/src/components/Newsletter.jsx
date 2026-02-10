import React, { useState } from 'react';
import styled from 'styled-components';
import { tokens, media } from '../styles/tokens';
import PlanetSection from './PlanetSection';

/* ─────────────────────────────────────────────
   NEWSLETTER – Light theme
   ───────────────────────────────────────────── */

const BENEFITS = [
  'Wöchentliche KI-Insights & Tutorials',
  'Exklusive Event-Einladungen',
  'Kostenlose Ressourcen & Templates',
  'Karriere-Tipps von Experten',
];

const Grid = styled.div`
  display: grid;
  grid-template-columns: 1fr;
  gap: ${tokens.spacing['2xl']};
  align-items: center;
  ${media.lg} { grid-template-columns: 1fr 1fr; }
`;

const BenefitList = styled.ul`
  display: flex;
  flex-direction: column;
  gap: ${tokens.spacing.md};
  margin-top: ${tokens.spacing.xl};
`;

const Benefit = styled.li`
  display: flex;
  align-items: center;
  gap: ${tokens.spacing.md};
  font-size: ${tokens.fontSizes.base};
  color: ${tokens.colors.textSoft};

  &::before {
    content: '';
    display: block;
    width: 20px; height: 20px;
    border-radius: ${tokens.radii.sm};
    background: ${tokens.colors.mintBg};
    border: 1.5px solid ${tokens.colors.mint};
    flex-shrink: 0;
    position: relative;
  }
`;

const FormCard = styled.div`
  padding: ${tokens.spacing['2xl']};
  background: ${tokens.colors.surface};
  border: 1px solid ${tokens.colors.glassBorder};
  border-radius: ${tokens.radii.xl};
  box-shadow: ${tokens.shadows.card};
`;

const FormGroup = styled.div`
  margin-bottom: ${tokens.spacing.lg};
`;

const Label = styled.label`
  display: block;
  font-size: ${tokens.fontSizes.sm};
  font-weight: ${tokens.fontWeights.medium};
  color: ${tokens.colors.textSoft};
  margin-bottom: ${tokens.spacing.sm};
`;

const Input = styled.input`
  width: 100%;
  padding: 12px 16px;
  font-family: ${tokens.fonts.body};
  font-size: ${tokens.fontSizes.base};
  color: ${tokens.colors.text};
  background: ${tokens.colors.surfaceAlt};
  border: 1px solid ${tokens.colors.glassBorder};
  border-radius: ${tokens.radii.md};
  outline: none;
  transition: border-color ${tokens.transitions.fast}, box-shadow ${tokens.transitions.fast};

  &::placeholder { color: ${tokens.colors.textDim}; }

  &:focus {
    border-color: ${tokens.colors.primary};
    box-shadow: 0 0 0 3px rgba(99, 102, 241, 0.1);
  }
`;

const SubmitBtn = styled.button`
  width: 100%;
  padding: 14px;
  font-family: ${tokens.fonts.body};
  font-size: ${tokens.fontSizes.base};
  font-weight: ${tokens.fontWeights.semi};
  color: #fff;
  background: ${tokens.colors.primary};
  border: none;
  border-radius: ${tokens.radii.md};
  text-transform: uppercase;
  letter-spacing: 0.03em;
  cursor: pointer;
  transition: background ${tokens.transitions.fast}, transform ${tokens.transitions.fast};

  &:hover { background: ${tokens.colors.primaryHover}; transform: translateY(-1px); }
  &:disabled { opacity: 0.5; cursor: not-allowed; transform: none; }
`;

const Privacy = styled.p`
  margin-top: ${tokens.spacing.md};
  font-size: ${tokens.fontSizes.xs};
  color: ${tokens.colors.textDim};
  line-height: ${tokens.lineHeights.relaxed};
  a { color: ${tokens.colors.primary}; text-decoration: underline; }
`;

const SuccessMsg = styled.div`
  text-align: center;
  padding: ${tokens.spacing['2xl']};
  h3 {
    font-family: ${tokens.fonts.display};
    font-size: ${tokens.fontSizes['2xl']};
    font-weight: ${tokens.fontWeights.bold};
    color: ${tokens.colors.mint};
    margin-bottom: ${tokens.spacing.sm};
  }
  p { color: ${tokens.colors.textMuted}; }
`;

export default function Newsletter() {
  const [submitted, setSubmitted] = useState(false);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (name && email) setSubmitted(true);
  };

  return (
    <PlanetSection
      id="newsletter"
      badge="Newsletter"
      title="Bleib an der <span>KI-Spitze</span>"
      subtitle="Erhalte wöchentlich exklusive Insights, Event-Einladungen und die neuesten KI-Trends direkt in dein Postfach. Über 5.000 Abonnenten vertrauen uns bereits."
      showStitch={false}
      accent={tokens.colors.glowMint}
    >
      <Grid>
        <div>
          <BenefitList>
            {BENEFITS.map((b) => <Benefit key={b}>{b}</Benefit>)}
          </BenefitList>
        </div>

        <FormCard>
          {submitted ? (
            <SuccessMsg>
              <h3>Willkommen an Bord!</h3>
              <p>Du erhältst in Kürze eine Bestätigungsmail.</p>
            </SuccessMsg>
          ) : (
            <form onSubmit={handleSubmit} noValidate>
              <FormGroup>
                <Label htmlFor="nl-name">Dein Name</Label>
                <Input id="nl-name" type="text" placeholder="Max Mustermann" value={name} onChange={(e) => setName(e.target.value)} required autoComplete="name" />
              </FormGroup>
              <FormGroup>
                <Label htmlFor="nl-email">E-Mail Adresse</Label>
                <Input id="nl-email" type="email" placeholder="max@beispiel.de" value={email} onChange={(e) => setEmail(e.target.value)} required autoComplete="email" />
              </FormGroup>
              <SubmitBtn type="submit" disabled={!name || !email}>Jetzt abonnieren</SubmitBtn>
              <Privacy>Mit der Anmeldung akzeptierst du unsere <a href="#">Datenschutzerklärung</a>. Abmeldung jederzeit möglich.</Privacy>
            </form>
          )}
        </FormCard>
      </Grid>
    </PlanetSection>
  );
}
