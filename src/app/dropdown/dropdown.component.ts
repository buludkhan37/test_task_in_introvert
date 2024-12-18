import { Component, OnInit, HostListener } from '@angular/core';
import { IndexedDBService } from '../services/indexed-db.service';

@Component({
  selector: 'app-dropdown',
  templateUrl: './dropdown.component.html',
  styleUrls: ['./dropdown.component.scss'],
})
export class DropdownComponent implements OnInit {
  isDropdownOpen = false;
  funnels: any[] = [];
  selectedCounts = '';
  private dbKey = 'funnelsState';

  constructor(private dbService: IndexedDBService) {}

  ngOnInit(): void {
    this.initializeData();
    this.loadState();
  }

  private initializeData(): void {
    this.funnels = [
      {
        name: 'Продажи',
        selected: false,
        isOpen: false,
        stages: [
          { name: 'Неразобранное', selected: false },
          { name: 'Переговоры', selected: false },
          { name: 'Принимают решение', selected: false },
          { name: 'Успешно', selected: false },
        ],
      },
      {
        name: 'Сотрудники',
        selected: false,
        isOpen: false,
        stages: [
          { name: 'Приняют решение', selected: false },
          { name: 'Успешно', selected: false },
        ],
      },
      {
        name: 'Партнеры',
        selected: false,
        isOpen: false,
        stages: [{ name: 'Переговоры', selected: false }],
      },
      {
        name: 'Ивент',
        selected: false,
        isOpen: false,
        stages: [{ name: 'Успешно', selected: false }],
      },
      {
        name: 'Входящие обращения',
        selected: false,
        isOpen: false,
        stages: [{ name: 'Неразобранное', selected: false },],
      },
    ];
  }

  toggleDropdown(): void {
    this.isDropdownOpen = !this.isDropdownOpen;
    this.updateSelectedCounts();
  }

  toggleFunnel(funnel: any): void {
    funnel.isOpen = !funnel.isOpen;
  }

  onFunnelChange(): void {
    this.updateSelectedCounts();
    this.saveState();
  }

  onStageChange(): void {
    this.updateSelectedCounts();
    this.saveState();
  }

  private updateSelectedCounts(): void {
    let funnelsCount = 0;
    let stagesCount = 0;

    this.funnels.forEach((funnel) => {
      if (funnel.selected) funnelsCount++;
      funnel.stages.forEach((stage: any) => {
        if (stage.selected) stagesCount++;
      });
    });

    this.selectedCounts = `${funnelsCount} воронки, ${stagesCount} этапов`;
  }

  private saveState(): void {
    this.dbService.saveState(this.dbKey, this.funnels);
  }

  private async loadState(): Promise<void> {
    const state = await this.dbService.getState(this.dbKey);
    if (state) this.funnels = state;
    this.updateSelectedCounts();
  }

  @HostListener('document:click', ['$event.target'])
  onClickOutside(target: HTMLElement): void {
    if (!target.closest('.dropdown')) {
      this.isDropdownOpen = false;
    }
  }
}
