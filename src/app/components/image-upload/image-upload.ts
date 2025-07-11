import { Component, EventEmitter, inject, Input, NgZone, OnChanges, Output, signal, Signal, WritableSignal, SimpleChanges } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-image-upload',
  imports: [MatButtonModule, MatIconModule],
  templateUrl: './image-upload.html',
  styleUrl: './image-upload.scss'
})
export class ImageUpload implements OnChanges {
  @Input() initialUrls: string[] = [];
  @Output() filesSelected = new EventEmitter<File[]>();

  private zone = inject(NgZone);
  @Input() readonly = false;

  previewUrls: WritableSignal<string[]> = signal([]);
  selectedFiles: File[] = [];

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['initialUrls']) {
      this.previewUrls.set([...this.initialUrls]);
    }
  }

  onFileSelected(event: any) {
    if (this.readonly) return;
    const files: FileList = event.target.files;
    this.addFiles(Array.from(files));
    event.target.value = '';
  }

  addFiles(files: File[]) {
    for (let file of files) {
      const reader = new FileReader();
      reader.onload = () => {
        this.zone.run(() => {
          this.previewUrls.set([...this.previewUrls(), reader.result as string]);
          this.selectedFiles.push(file);
          this.filesSelected.emit(this.selectedFiles);
        });
      };
      reader.readAsDataURL(file);
    }
  }

  removeImage(index: number) {
    if (this.readonly) return;
    const updatedPreviews = [...this.previewUrls()];
    updatedPreviews.splice(index, 1);
    this.previewUrls.set(updatedPreviews);

    if (index < this.selectedFiles.length) {
      this.selectedFiles.splice(index, 1);
    }

    this.filesSelected.emit(this.selectedFiles);
  }

  fullPreviewUrl: string | null = null;

  showFullPreview(url: string) {
    this.fullPreviewUrl = url;
  }

  closePreview() {
    this.fullPreviewUrl = null;
  }
}
