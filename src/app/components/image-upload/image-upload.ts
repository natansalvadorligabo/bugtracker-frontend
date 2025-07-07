import { Component, EventEmitter, inject, Input, NgZone, Output } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-image-upload',
  imports: [MatButtonModule, MatIconModule],
  templateUrl: './image-upload.html',
  styleUrl: './image-upload.scss'
})
export class ImageUpload {
  @Input() initialUrls: string[] = [];
  @Output() filesSelected = new EventEmitter<File[]>();

  private zone = inject(NgZone);

  previewUrls: string[] = [];
  selectedFiles: File[] = [];

  ngOnInit() {
    if (this.initialUrls.length > 0) {
      this.previewUrls = [...this.initialUrls];
    }
  }

  onFileSelected(event: any) {
    const files: FileList = event.target.files;
    this.addFiles(Array.from(files));
    event.target.value = '';
  }

  addFiles(files: File[]) {
    for (let file of files) {
      this.selectedFiles.push(file);

      const reader = new FileReader();
      reader.onload = () => {
        this.zone.run(() => {
          this.previewUrls.push(reader.result as string);
          this.filesSelected.emit(this.selectedFiles);
        });
      };
      reader.readAsDataURL(file);
    }
  }

  removeImage(index: number) {
    this.previewUrls.splice(index, 1);
    this.selectedFiles.splice(index, 1);
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
