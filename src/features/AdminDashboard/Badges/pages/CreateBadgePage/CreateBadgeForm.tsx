import { Controller, SubmitHandler, useFormContext } from "react-hook-form";
import Button from "src/Components/Button/Button";
import AvatarInput from "src/Components/Inputs/FilesInputs/AvatarInput/AvatarInput";
import { Badge, useCreateOrUpdateBadgeMutation } from "src/graphql";
import { NotificationsService } from "src/services";
import { extractErrorMessage } from "src/utils/helperFunctions";
import BadgeTypeInput from "./BadgeTypeInput";
import { CreateBadgeFormType } from "./CreateBadgePage";

interface Props {
  badgeId?: number;
  onCreated?: (badge: Partial<Badge>) => void;
}

export default function CreateBadgeForm({ badgeId, onCreated }: Props) {
  const {
    register,
    formState: { errors },
    handleSubmit,
    control,
  } = useFormContext<CreateBadgeFormType>();

  const [mutate, { loading }] = useCreateOrUpdateBadgeMutation();

  const onSubmit: SubmitHandler<CreateBadgeFormType> = async (data) => {
    if (loading) return console.log("loading");
    try {
      const res = await mutate({
        variables: {
          input: {
            ...data,
            id: badgeId,
          },
        },
      });
      const badgeData = res.data?.createOrUpdateBadge;
      NotificationsService.success(
        badgeId ? "Badge updated successfully" : "Badge created successfully"
      );
      if (badgeId && badgeData) {
        onCreated?.(badgeData);
      }
    } catch (error) {
      NotificationsService.error(
        extractErrorMessage(error) ?? "Something went wrong"
      );
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-16">
      <div>
        <label htmlFor="title-input" className="text-body5">
          Title<sup className="text-red-500">*</sup>
        </label>
        <div className="input-wrapper mt-8 relative">
          <input
            id="title-input"
            autoFocus
            type="text"
            className="input-text"
            placeholder="Badge Title 🎖️"
            {...register("title")}
          />
        </div>
        {errors.title && <p className="input-error">{errors.title.message}</p>}
      </div>
      <div>
        <label htmlFor="description-input" className="text-body5">
          Description<sup className="text-red-500">*</sup>
        </label>
        <div className="input-wrapper mt-8 relative">
          <input
            id="description-input"
            type="text"
            className="input-text"
            placeholder="Write 5 awesome stories on BOLT.FUN"
            {...register("description")}
          />
        </div>
        {errors.description && (
          <p className="input-error">{errors.description.message}</p>
        )}
      </div>

      <div>
        <label htmlFor="slug-input" className="text-body5">
          Slug<sup className="text-red-500">*</sup>
        </label>
        <div className="input-wrapper mt-8 relative">
          <input
            id="slug-input"
            type="text"
            className="input-text"
            placeholder="badge-title"
            {...register("slug")}
          />
        </div>
        {errors.slug && <p className="input-error">{errors.slug.message}</p>}
      </div>

      <div>
        <label htmlFor="image-input" className="text-body5">
          Image<sup className="text-red-500">*</sup>
        </label>

        <div className="mt-16">
          <Controller
            control={control}
            name="image"
            render={({ field: { onChange, value } }) => (
              <AvatarInput
                value={{ url: value }}
                onChange={(data) => onChange(data?.url)}
                width={120}
              />
            )}
          />
        </div>
        {errors.image && <p className="input-error">{errors.image.message}</p>}
      </div>

      <div>
        <label htmlFor="color-input" className="text-body5">
          Color
        </label>
        <div className="mt-8 relative">
          <input
            id="color-input"
            type="color"
            className=""
            {...register("color")}
          />
        </div>
        {errors.color && <p className="input-error">{errors.color.message}</p>}
      </div>
      <div>
        <label htmlFor="winning-template-input" className="text-body5">
          Winning Description Template
        </label>
        <div className="input-wrapper mt-8 relative">
          <textarea
            id="winning-template-input"
            rows={3}
            className="input-text"
            placeholder="{username} wrote 10 stories on BOLT.FUN!"
            {...register("winningDescriptionTemplate")}
          />
        </div>
        {errors.winningDescriptionTemplate && (
          <p className="input-error">
            {errors.winningDescriptionTemplate.message}
          </p>
        )}
      </div>
      <BadgeTypeInput />
      <div>
        <label htmlFor="image-input" className="text-body5">
          Badge Definition Event Id on Nostr
        </label>
        <div className="input-wrapper mt-8 relative">
          <input
            id="image-input"
            type="text"
            className="input-text"
            placeholder="a3bfa2e702...."
            {...register("badgeDefinitionNostrEventId")}
          />
        </div>
        {errors.badgeDefinitionNostrEventId && (
          <p className="input-error">
            {errors.badgeDefinitionNostrEventId.message}
          </p>
        )}
      </div>
      <Button
        isLoading={loading}
        color="primary"
        type="submit"
        className="mt-24"
      >
        Save Badge
      </Button>
    </form>
  );
}
