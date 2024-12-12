"use client";

import React, { useState } from "react";

import { PlusCircle, X, Save } from "lucide-react";
import { Label } from "./ui/label";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { Exhibition, type Contributor } from "~/lib/types/entities";
import { useUpdateExhibition } from "~/hooks/exhibition-actions";

type ContributorFormProps = {
  exhibition: Exhibition;
};

const ContributorForm: React.FC<ContributorFormProps> = ({ exhibition }) => {
  const [contributors, setContributors] = useState<Contributor[]>(
    exhibition.contributors?.length !== 0
      ? exhibition.contributors
      : [{ role: "", names: "" }],
  );

  const updateExhibition = useUpdateExhibition();

  const addContributorField = () => {
    setContributors([...contributors, { role: "", names: "" }]);
  };

  const updateContributor = (
    index: number,
    field: keyof Contributor,
    value: string,
  ) => {
    const updatedContributors = contributors.map((contributor, i) => {
      if (i === index) {
        return { ...contributor, [field]: value };
      }
      return contributor;
    });
    setContributors(updatedContributors);
  };

  const removeContributor = (index: number) => {
    const updatedContributors = contributors.filter((_, i) => i !== index);
    setContributors(updatedContributors);
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    const validContributors = contributors.filter(
      (c) => c.role.trim() !== "" && c.names.trim() !== "",
    );
    updateExhibition.mutate({
      id: exhibition.id,
      name: exhibition.name,
      contributors: validContributors,
    });
  };

  return (
    <form
      onSubmit={handleSave}
      className="mx-auto max-w-2xl space-y-6 rounded-lg bg-background p-6 shadow"
    >
      <h1 className="mb-4 text-2xl font-bold">Exhibiton Contributors</h1>
      <div className="space-y-4">
        {contributors.map((contributor, index) => (
          <div key={index} className="flex items-center space-x-2">
            <div className="grid flex-grow grid-cols-2 gap-2">
              <div>
                <Label htmlFor={`role-${index}`} className="sr-only">
                  Role
                </Label>
                <Input
                  id={`role-${index}`}
                  value={contributor.role}
                  onChange={(e) =>
                    updateContributor(index, "role", e.target.value)
                  }
                  placeholder="Role (e.g., Director)"
                />
              </div>
              <div>
                <Label htmlFor={`name-${index}`} className="sr-only">
                  Name
                </Label>
                <Input
                  id={`name-${index}`}
                  value={contributor.names}
                  onChange={(e) =>
                    updateContributor(index, "names", e.target.value)
                  }
                  placeholder="Contributor's name"
                />
              </div>
            </div>
            {contributors.length > 1 && (
              <Button
                type="button"
                onClick={() => removeContributor(index)}
                size="icon"
                variant="ghost"
              >
                <X className="h-4 w-4" />
              </Button>
            )}
          </div>
        ))}
      </div>
      <div className="flex justify-between">
        <Button type="button" onClick={addContributorField} variant="outline">
          <PlusCircle className="mr-2 h-4 w-4" />
          Add Contributor
        </Button>
        <Button type="submit">
          <Save className="mr-2 h-4 w-4" />
          Save Contributors
        </Button>
      </div>
    </form>
  );
};

export default ContributorForm;
