import { ThunderboltOutlined } from '@ant-design/icons';
import { Button, Input } from 'antd';
import React, { useEffect, useState } from 'react';
import Modal from '../../ui/modal';
import { Paragraph, Text } from '../../ui/typography';
import ProjectAiGeneratingOverlay from '../projects/project-form/project-ai-generating-overlay';

type AiGeneratePromptModalProps = {
  open: boolean;
  loading?: boolean;
  entityLabel: 'project' | 'task';
  requireName?: boolean;
  initialName?: string;
  initialPrompt?: string;
  onClose: () => void;
  onGenerate: (payload: { name: string; prompt: string }) => Promise<void> | void;
};

function AiGeneratePromptModal({
  open,
  loading = false,
  entityLabel,
  requireName = false,
  initialName = '',
  initialPrompt = '',
  onClose,
  onGenerate,
}: AiGeneratePromptModalProps) {
  const [name, setName] = useState(initialName);
  const [prompt, setPrompt] = useState(initialPrompt);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!open) return;
    setName(initialName);
    setPrompt(initialPrompt);
    setError('');
  }, [initialName, initialPrompt, open]);

  const handleGenerate = async () => {
    const trimmedName = name.trim();
    const trimmedPrompt = prompt.trim();

    if (requireName && !trimmedName) {
      setError(`${entityLabel === 'project' ? 'Project' : 'Task'} name is required.`);
      return;
    }

    if (!trimmedPrompt) {
      setError('Add a short description or requirements for AI.');
      return;
    }

    setError('');
    await onGenerate({ name: trimmedName, prompt: trimmedPrompt });
  };

  return (
    <>
      <ProjectAiGeneratingOverlay open={loading} />
      <Modal
        open={open}
        onCancel={loading ? undefined : onClose}
        title={
          <span className="inline-flex items-center gap-2">
            <ThunderboltOutlined className="text-primary" />
            AI Generate {entityLabel}
          </span>
        }
        footer={null}
        destroyOnHidden
        maskClosable={!loading}
        closable={!loading}
        width={560}
      >
        <Paragraph size="sm" color="muted" className="mb-4!">
          Describe what you need. AI fills the {entityLabel} form fields on this page — you still
          save or create yourself.
        </Paragraph>

        {requireName ? (
          <div className="mb-4">
            <Text as="label" size="sm" weight="semibold" className="mb-2! block">
              {entityLabel === 'project' ? 'Project name' : 'Task title'}{' '}
              <span className="text-red-500">*</span>
            </Text>
            <Input
              size="large"
              value={name}
              onChange={(event) => setName(event.target.value)}
              placeholder={
                entityLabel === 'project'
                  ? 'e.g. Ecommerce Platform'
                  : 'e.g. Implement checkout API'
              }
              disabled={loading}
              className="rounded-xl!"
            />
          </div>
        ) : null}

        <div>
          <Text as="label" size="sm" weight="semibold" className="mb-2! block">
            Description / requirements <span className="text-red-500">*</span>
          </Text>
          <Input.TextArea
            rows={5}
            value={prompt}
            onChange={(event) => setPrompt(event.target.value)}
            placeholder={
              entityLabel === 'project'
                ? 'e.g. Ecommerce project, Fulaah as admin lead, Pulah in squad...'
                : 'e.g. Build login API with JWT, assign to Martin, high priority...'
            }
            disabled={loading}
            className="rounded-xl!"
          />
        </div>

        {error ? (
          <Paragraph size="sm" className="mt-3 mb-0! text-red-500">
            {error}
          </Paragraph>
        ) : null}

        <div className="mt-5 flex justify-end gap-2">
          <Button onClick={onClose} disabled={loading}>
            Cancel
          </Button>
          <Button
            type="primary"
            icon={<ThunderboltOutlined />}
            loading={loading}
            onClick={() => {
              void handleGenerate();
            }}
          >
            AI Generate
          </Button>
        </div>
      </Modal>
    </>
  );
}

export function AiGenerateHeaderButton({
  onClick,
  disabled,
}: {
  onClick: () => void;
  disabled?: boolean;
}) {
  return (
    <Button
      type="primary"
      icon={<ThunderboltOutlined />}
      onClick={onClick}
      disabled={disabled}
      className="font-semibold!"
    >
      AI Generate
    </Button>
  );
}

export default React.memo(AiGeneratePromptModal);
