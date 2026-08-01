"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useCategories } from "@/lib/queries/categories";
import {
  useCreateCategory,
  useUpdateCategory,
  useDeleteCategory,
} from "@/lib/queries/admin";
import { categorySchema, CategoryFormValues } from "@/lib/validators/category";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { PencilIcon, TrashIcon, PlusIcon } from "lucide-react";
import { Category } from "@/types";

type EditingState = Category | "new" | null;

export default function AdminCategoriesPage() {
  const { data: categories, isLoading } = useCategories();
  const { mutate: createCategory, isPending: isCreating } = useCreateCategory();
  const { mutate: updateCategory, isPending: isUpdating } = useUpdateCategory();
  const { mutate: deleteCategory, isPending: isDeleting } = useDeleteCategory();

  const [editingCategory, setEditingCategory] = useState<EditingState>(null);
  const [categoryToDelete, setCategoryToDelete] = useState<Category | null>(null);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<CategoryFormValues>({
    resolver: zodResolver(categorySchema),
  });

  const openNewCategoryDialog = () => {
    reset({ name: "", slug: "" });
    setEditingCategory("new");
  };

  const openEditCategoryDialog = (cat: Category) => {
    reset({ name: cat.name, slug: cat.slug });
    setEditingCategory(cat);
  };

  const onSubmit = (values: CategoryFormValues) => {
    if (editingCategory === "new") {
      createCategory(values, {
        onSuccess: () => setEditingCategory(null),
      });
    } else if (editingCategory && typeof editingCategory === "object") {
      updateCategory(
        { id: editingCategory.id, ...values },
        { onSuccess: () => setEditingCategory(null) },
      );
    }
  };

  const handleDelete = () => {
    if (!categoryToDelete) return;
    deleteCategory(categoryToDelete.id, {
      onSuccess: () => setCategoryToDelete(null),
    });
  };

  return (
    <div className="mx-auto max-w-4xl px-4 py-10">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Category Management</h1>
          <p className="text-sm text-gray-500">Manage rental equipment categories</p>
        </div>
        <Button onClick={openNewCategoryDialog}>
          <PlusIcon className="mr-1 size-4" />
          New Category
        </Button>
      </div>

      {isLoading ? (
        <div className="space-y-3">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="h-12 animate-pulse rounded bg-gray-200" />
          ))}
        </div>
      ) : categories && categories.length > 0 ? (
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Slug</TableHead>
                <TableHead className="w-32 text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {categories.map((cat) => (
                <TableRow key={cat.id}>
                  <TableCell className="font-medium">{cat.name}</TableCell>
                  <TableCell className="font-mono text-xs text-gray-600">{cat.slug}</TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => openEditCategoryDialog(cat)}
                      >
                        <PencilIcon className="size-4" />
                        <span className="sr-only">Edit</span>
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setCategoryToDelete(cat)}
                      >
                        <TrashIcon className="size-4 text-red-500" />
                        <span className="sr-only">Delete</span>
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      ) : (
        <div className="rounded-lg border p-8 text-center text-gray-500">
          No categories found. Click "New Category" above to create one.
        </div>
      )}

      {/* New / Edit Category Modal */}
      <Dialog open={!!editingCategory} onOpenChange={(open) => !open && setEditingCategory(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {editingCategory === "new" ? "New Category" : "Edit Category"}
            </DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div className="space-y-1">
              <Label htmlFor="name">Name</Label>
              <Input id="name" placeholder="e.g. Camping Gear" {...register("name")} />
              {errors.name && (
                <p className="text-sm text-red-500">{errors.name.message}</p>
              )}
            </div>
            <div className="space-y-1">
              <Label htmlFor="slug">Slug</Label>
              <Input id="slug" placeholder="e.g. camping-gear" {...register("slug")} />
              {errors.slug && (
                <p className="text-sm text-red-500">{errors.slug.message}</p>
              )}
            </div>
            <DialogFooter className="flex gap-2 justify-end">
              <Button
                type="button"
                variant="outline"
                onClick={() => setEditingCategory(null)}
                disabled={isCreating || isUpdating}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={isCreating || isUpdating}>
                {isCreating || isUpdating ? "Saving…" : "Save"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Delete Category Modal */}
      <Dialog open={!!categoryToDelete} onOpenChange={(open) => !open && setCategoryToDelete(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Category</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete category &ldquo;{categoryToDelete?.name}&rdquo;?
              This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="flex gap-2 justify-end">
            <Button
              variant="outline"
              onClick={() => setCategoryToDelete(null)}
              disabled={isDeleting}
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={handleDelete}
              disabled={isDeleting}
            >
              {isDeleting ? "Deleting…" : "Delete"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
