package com.server.model.base;

import lombok.Data;
import lombok.EqualsAndHashCode;
import java.util.List;

@Data
@EqualsAndHashCode(callSuper = true)
public abstract class EditableEntity extends BaseEntity {
    protected boolean isEdited;
    protected List<String> editedList;
} 